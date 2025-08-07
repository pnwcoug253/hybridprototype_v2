import { VM, Host, Datastore } from '../data/vmwareData';

export interface CostProfile {
  cpuCostPerCoreMonth: number;
  memoryCostPerGBMonth: number;
  storageCostPerGBMonth: number;
  powerCoolingPerVMMonth: number;
  softwareLicensePerVMMonth: number;
}

export const defaultCostProfile: CostProfile = {
  cpuCostPerCoreMonth: 50,
  memoryCostPerGBMonth: 10,
  storageCostPerGBMonth: 0.10,
  powerCoolingPerVMMonth: 25,
  softwareLicensePerVMMonth: 30
};

export const calculateVMCost = (vm: VM, profile: CostProfile): number => {
  if (vm.powerState === 'poweredOff') {
    // Powered off VMs still cost storage and some licensing
    return (vm.storageGB * profile.storageCostPerGBMonth) + (profile.softwareLicensePerVMMonth * 0.5);
  }
  
  const cpuCost = vm.vCPU * profile.cpuCostPerCoreMonth;
  const memoryCost = vm.memoryGB * profile.memoryCostPerGBMonth;
  const storageCost = vm.storageGB * profile.storageCostPerGBMonth;
  const powerCooling = profile.powerCoolingPerVMMonth;
  const licensing = profile.softwareLicensePerVMMonth;
  
  return cpuCost + memoryCost + storageCost + powerCooling + licensing;
};

export const calculateTotalCosts = (vms: VM[], profile: CostProfile) => {
  const totalMonthly = vms.reduce((sum, vm) => sum + calculateVMCost(vm, profile), 0);
  const byDepartment: { [key: string]: number } = {};
  const byEnvironment: { [key: string]: number } = {};
  const byApplication: { [key: string]: number } = {};
  
  vms.forEach(vm => {
    const cost = calculateVMCost(vm, profile);
    const dept = vm.tags.department || 'Unallocated';
    const env = vm.tags.environment || 'Untagged';
    const app = vm.tags.application || 'Unknown';
    
    byDepartment[dept] = (byDepartment[dept] || 0) + cost;
    byEnvironment[env] = (byEnvironment[env] || 0) + cost;
    byApplication[app] = (byApplication[app] || 0) + cost;
  });
  
  return {
    totalMonthly,
    totalDaily: totalMonthly / 30,
    byDepartment,
    byEnvironment,
    byApplication
  };
};

export const identifyOptimizationOpportunities = (vms: VM[]) => {
  const oversized = vms.filter(vm => 
    vm.powerState === 'poweredOn' && 
    (vm.cpuUsageAvg < 20 || vm.memoryUsageAvg < 30)
  );
  
  const zombies = vms.filter(vm => 
    vm.powerState === 'poweredOn' && 
    vm.cpuUsageAvg < 5 && 
    vm.memoryUsageAvg < 15
  );
  
  const poweredOff = vms.filter(vm => 
    vm.powerState === 'poweredOff'
  );
  
  const missingTags = vms.filter(vm => 
    !vm.tags.department || !vm.tags.environment || !vm.tags.application
  );
  
  return {
    oversized,
    zombies,
    poweredOff,
    missingTags,
    totalSavingsOpportunity: (oversized.length * 500) + (zombies.length * 300) + (poweredOff.length * 100)
  };
};

export interface AdvancedCostProfile {
  baseProfile: CostProfile;
  environmentMultipliers: {
    Production: number;
    Development: number;
    Test: number;
    [key: string]: number;
  };
  departmentOverrides?: {
    [department: string]: Partial<CostProfile>;
  };
  depreciationYears: number;
  facilitiesCostPerMonth: number;
  staffCostPerMonth: number;
}

export const defaultAdvancedProfile: AdvancedCostProfile = {
  baseProfile: defaultCostProfile,
  environmentMultipliers: {
    Production: 1.5,
    Development: 0.7,
    Test: 0.5
  },
  depreciationYears: 5,
  facilitiesCostPerMonth: 5000,
  staffCostPerMonth: 25000
};

export const calculateAdvancedVMCost = (vm: VM, profile: AdvancedCostProfile): number => {
  const env = vm.tags.environment || 'Untagged';
  const dept = vm.tags.department;
  
  // Start with base profile or department override
  let costProfile = profile.baseProfile;
  if (dept && profile.departmentOverrides?.[dept]) {
    costProfile = { ...profile.baseProfile, ...profile.departmentOverrides[dept] };
  }
  
  // Calculate base cost
  let cost = calculateVMCost(vm, costProfile);
  
  // Apply environment multiplier
  const multiplier = profile.environmentMultipliers[env] || 1.0;
  cost = cost * multiplier;
  
  // Add proportional facilities and staff costs
  const totalVMs = 25; // In real app, would be dynamic
  cost += (profile.facilitiesCostPerMonth / totalVMs);
  cost += (profile.staffCostPerMonth / totalVMs);
  
  return cost;
};