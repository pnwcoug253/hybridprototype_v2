// @ts-nocheck

import React, { useState } from 'react';
import { Button, TextInput, NumberInput, RadioButton, RadioButtonGroup, Dropdown } from '@carbon/react';
import { ArrowLeft, ArrowRight, Calculator, Cloud, Information } from '@carbon/icons-react';
import { VM, Host } from '../data/vmwareData';
import { CostProfile, calculateTotalCosts } from '../utils/costCalculations';

interface GuidedSetupProps {
  vms: VM[];
  hosts: Host[];
  onComplete: (profile: CostProfile) => void;
  onBack: () => void;
}

const GuidedSetup: React.FC<GuidedSetupProps> = ({ vms, hosts, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<CostProfile>({
    cpuCostPerCoreMonth: 0,
    memoryCostPerGBMonth: 0,
    storageCostPerGBMonth: 0,
    powerCoolingPerVMMonth: 0,
    softwareLicensePerVMMonth: 0
  });
  
  // Step 1: Hardware Costs
  const [depreciationYears, setDepreciationYears] = useState(5);
  const [totalHardwareCost, setTotalHardwareCost] = useState(
    hosts.reduce((sum, host) => sum + host.purchasePrice, 0)
  );
  
  // Step 2: Operating Expenses
  const [powerCooling, setPowerCooling] = useState(5000);
  const [facilities, setFacilities] = useState(3000);
  const [networkBandwidth, setNetworkBandwidth] = useState(2000);
  const [staffAllocation, setStaffAllocation] = useState(25000);
  
  // Step 3: Software Licensing
  const [vmwareLicense, setVmwareLicense] = useState(3000);
  const [windowsLicense, setWindowsLicense] = useState(100);
  const [sqlLicense, setSqlLicense] = useState(0);
  
  const calculateStep1 = () => {
    const monthlyHardware = totalHardwareCost / (depreciationYears * 12);
    const totalCores = hosts.reduce((sum, host) => sum + host.cpuCores, 0);
    const totalMemory = hosts.reduce((sum, host) => sum + host.memoryGB, 0);
    
    setProfile(prev => ({
      ...prev,
      cpuCostPerCoreMonth: monthlyHardware * 0.4 / totalCores,
      memoryCostPerGBMonth: monthlyHardware * 0.4 / totalMemory,
      storageCostPerGBMonth: monthlyHardware * 0.2 / 50000 // Assuming 50TB total storage
    }));
  };
  
  const calculateStep2 = () => {
    const totalMonthlyOpex = powerCooling + facilities + networkBandwidth + staffAllocation;
    const perVMOpex = totalMonthlyOpex / vms.length;
    
    setProfile(prev => ({
      ...prev,
      powerCoolingPerVMMonth: perVMOpex
    }));
  };
  
  const calculateStep3 = () => {
    const totalSoftware = (vmwareLicense / 12) + windowsLicense + sqlLicense;
    
    setProfile(prev => ({
      ...prev,
      softwareLicensePerVMMonth: totalSoftware / vms.length
    }));
  };
  
  const nextStep = () => {
    if (currentStep === 1) calculateStep1();
    if (currentStep === 2) calculateStep2();
    if (currentStep === 3) calculateStep3();
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const costs = calculateTotalCosts(vms, profile);
  
  return (
    <div className="main-content">
      <Button 
        kind="ghost" 
        size="sm" 
        renderIcon={ArrowLeft}
        onClick={onBack}
        style={{ marginBottom: '2rem' }}
      >
        Back to Path Selection
      </Button>
      
      <h1>Guided Cost Configuration</h1>
      <p style={{ color: '#525252', marginBottom: '2rem' }}>
        Step {currentStep} of 4: {
          currentStep === 1 ? 'Hardware Costs' :
          currentStep === 2 ? 'Operating Expenses' :
          currentStep === 3 ? 'Software Licensing' :
          'Review & Validate'
        }
      </p>
      
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
      </div>
      
      {currentStep === 1 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Step 1: Hardware Costs</h2>
          <p style={{ color: '#525252', marginBottom: '2rem' }}>
            Configure how your hardware purchase costs are allocated
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="cost-display">
              <h4>
                <Calculator size={20} style={{ marginRight: '0.5rem' }} />
                Depreciation Calculator
              </h4>
              
              <div style={{ marginTop: '1.5rem' }}>
                <NumberInput
                  id="hardware-cost"
                  label="Total Hardware Investment"
                  helperText="Combined purchase price of all servers"
                  value={totalHardwareCost}
                  onChange={(e: any, { value }: any) => setTotalHardwareCost(value)}
                  min={0}
                  step={1000}
                />
                
                <RadioButtonGroup
                  name="depreciation"
                  legendText="Depreciation Period"
                  valueSelected={depreciationYears.toString()}
                  onChange={(value: string) => setDepreciationYears(parseInt(value))}
                  style={{ marginTop: '1.5rem' }}
                >
                  <RadioButton labelText="3 years" value="3" />
                  <RadioButton labelText="5 years (Recommended)" value="5" />
                  <RadioButton labelText="7 years" value="7" />
                </RadioButtonGroup>
                
                <div style={{ 
                  marginTop: '2rem', 
                  padding: '1rem', 
                  background: '#f4f4f4',
                  borderRadius: '4px'
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#525252' }}>Monthly Hardware Cost:</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f62fe' }}>
                    ${(totalHardwareCost / (depreciationYears * 12)).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="cost-display">
              <h4>Detected Hardware</h4>
              <table style={{ width: '100%', marginTop: '1rem' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '0.5rem 0', color: '#525252' }}>Host</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem 0', color: '#525252' }}>Cores</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem 0', color: '#525252' }}>Memory</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem 0', color: '#525252' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {hosts.map(host => (
                    <tr key={host.id}>
                      <td style={{ padding: '0.5rem 0' }}>{host.name.split('.')[0]}</td>
                      <td style={{ textAlign: 'right', padding: '0.5rem 0' }}>{host.cpuCores}</td>
                      <td style={{ textAlign: 'right', padding: '0.5rem 0' }}>{host.memoryGB}GB</td>
                      <td style={{ textAlign: 'right', padding: '0.5rem 0' }}>
                        ${host.purchasePrice.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {currentStep === 2 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Step 2: Operating Expenses</h2>
          <p style={{ color: '#525252', marginBottom: '2rem' }}>
            Define your monthly operational costs
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="cost-display">
              <h4>Data Center Costs (Monthly)</h4>
              
              <NumberInput
                id="power-cooling"
                label="Power & Cooling"
                helperText="Electricity and HVAC costs"
                value={powerCooling}
                onChange={(e: any, { value }: any) => setPowerCooling(value)}
                min={0}
                step={100}
                style={{ marginTop: '1rem' }}
              />
              
              <NumberInput
                id="facilities"
                label="Facilities/Rack Space"
                helperText="Data center lease or allocation"
                value={facilities}
                onChange={(e: any, { value }: any) => setFacilities(value)}
                min={0}
                step={100}
                style={{ marginTop: '1rem' }}
              />
              
              <NumberInput
                id="network"
                label="Network/Bandwidth"
                helperText="Internet and network infrastructure"
                value={networkBandwidth}
                onChange={(e: any, { value }: any) => setNetworkBandwidth(value)}
                min={0}
                step={100}
                style={{ marginTop: '1rem' }}
              />
              
              <NumberInput
                id="staff"
                label="Staff Allocation"
                helperText="Portion of IT staff costs"
                value={staffAllocation}
                onChange={(e: any, { value }: any) => setStaffAllocation(value)}
                min={0}
                step={1000}
                style={{ marginTop: '1rem' }}
              />
            </div>
            
            <div className="cost-display">
              <h4>Cost Distribution</h4>
              
              <div style={{ marginTop: '1rem' }}>
                <div style={{ padding: '1rem 0', borderBottom: '1px solid #e0e0e0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Power & Cooling</span>
                    <span style={{ fontWeight: 'bold' }}>${powerCooling.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ padding: '1rem 0', borderBottom: '1px solid #e0e0e0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Facilities</span>
                    <span style={{ fontWeight: 'bold' }}>${facilities.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ padding: '1rem 0', borderBottom: '1px solid #e0e0e0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Network</span>
                    <span style={{ fontWeight: 'bold' }}>${networkBandwidth.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ padding: '1rem 0', borderBottom: '1px solid #e0e0e0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Staff</span>
                    <span style={{ fontWeight: 'bold' }}>${staffAllocation.toLocaleString()}</span>
                  </div>
                </div>
                
                <div style={{ 
                  marginTop: '2rem', 
                  padding: '1rem', 
                  background: '#f4f4f4',
                  borderRadius: '4px'
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#525252' }}>Total Monthly OpEx:</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f62fe' }}>
                    ${(powerCooling + facilities + networkBandwidth + staffAllocation).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#525252', marginTop: '0.5rem' }}>
                    Per VM: ${((powerCooling + facilities + networkBandwidth + staffAllocation) / vms.length).toFixed(0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {currentStep === 3 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Step 3: Software Licensing</h2>
          <p style={{ color: '#525252', marginBottom: '2rem' }}>
            Configure your software license costs
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="cost-display">
              <h4>License Configuration</h4>
              
              <NumberInput
                id="vmware"
                label="VMware vSphere (Annual)"
                helperText="Per CPU socket licensing"
                value={vmwareLicense}
                onChange={(e: any, { value }: any) => setVmwareLicense(value)}
                min={0}
                step={100}
                style={{ marginTop: '1rem' }}
              />
              
              <NumberInput
                id="windows"
                label="Windows Server (Monthly per VM)"
                helperText="Windows Server Datacenter"
                value={windowsLicense}
                onChange={(e: any, { value }: any) => setWindowsLicense(value)}
                min={0}
                step={10}
                style={{ marginTop: '1rem' }}
              />
              
              <NumberInput
                id="sql"
                label="SQL Server (Monthly per VM)"
                helperText="Leave 0 if not applicable"
                value={sqlLicense}
                onChange={(e: any, { value }: any) => setSqlLicense(value)}
                min={0}
                step={100}
                style={{ marginTop: '1rem' }}
              />
              
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                background: '#e5f6ff',
                borderRadius: '4px',
                border: '1px solid #0f62fe'
              }}>
                <Information size={16} style={{ marginRight: '0.5rem', color: '#0f62fe' }} />
                <span style={{ fontSize: '0.875rem', color: '#0f62fe' }}>
                  You can add more software licenses after initial setup
                </span>
              </div>
            </div>
            
            <div className="cost-display">
              <h4>License Cost Summary</h4>
              
              <table style={{ width: '100%', marginTop: '1rem' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.75rem 0', color: '#525252' }}>VMware vSphere</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      ${(vmwareLicense / 12).toFixed(0)}/month
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem 0', color: '#525252' }}>Windows Server</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      ${(windowsLicense * vms.filter(vm => vm.powerState === 'poweredOn').length).toFixed(0)}/month
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem 0', color: '#525252' }}>SQL Server</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      ${(sqlLicense * 2).toFixed(0)}/month
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div style={{ 
                marginTop: '2rem', 
                padding: '1rem', 
                background: '#f4f4f4',
                borderRadius: '4px'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#525252' }}>Total Software Licensing:</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f62fe' }}>
                  ${((vmwareLicense / 12) + (windowsLicense * vms.filter(vm => vm.powerState === 'poweredOn').length) + (sqlLicense * 2)).toLocaleString()}/month
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {currentStep === 4 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Step 4: Review & Validate</h2>
          <p style={{ color: '#525252', marginBottom: '2rem' }}>
            Review your configuration before applying
          </p>
          
          <div className="cost-display">
            <h4>Configuration Summary</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
              <div>
                <h5 style={{ color: '#525252', marginBottom: '1rem' }}>Hardware Costs</h5>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                  ${(totalHardwareCost / (depreciationYears * 12)).toLocaleString()}/month
                </div>
                <div style={{ fontSize: '0.875rem', color: '#525252' }}>
                  {depreciationYears} year depreciation
                </div>
              </div>
              
              <div>
                <h5 style={{ color: '#525252', marginBottom: '1rem' }}>Operating Expenses</h5>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                  ${(powerCooling + facilities + networkBandwidth + staffAllocation).toLocaleString()}/month
                </div>
                <div style={{ fontSize: '0.875rem', color: '#525252' }}>
                  Facilities, power, staff
                </div>
              </div>
              
              <div>
                <h5 style={{ color: '#525252', marginBottom: '1rem' }}>Software Licensing</h5>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                  ${((vmwareLicense / 12) + (windowsLicense * vms.filter(vm => vm.powerState === 'poweredOn').length)).toLocaleString()}/month
                </div>
                <div style={{ fontSize: '0.875rem', color: '#525252' }}>
                  VMware, Windows, etc.
                </div>
              </div>
            </div>
            
            <div style={{ 
              marginTop: '2rem', 
              padding: '2rem', 
              background: 'linear-gradient(135deg, #e5f6ff 0%, #f4f4f4 100%)',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1rem', color: '#525252', marginBottom: '0.5rem' }}>
                Total Estimated Monthly Cost
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#0f62fe' }}>
                ${costs.totalMonthly.toLocaleString()}
              </div>
              <div style={{ fontSize: '1rem', color: '#525252' }}>
                ${costs.totalDaily.toFixed(0)} per day
              </div>
            </div>
            
            {costs.totalMonthly > 50000 && (
              <div className="warning-banner" style={{ marginTop: '2rem' }}>
                <h5>Cost Validation</h5>
                <p>Your configured costs seem high. Common causes:</p>
                <ul>
                  <li>• Check if annual costs were entered as monthly</li>
                  <li>• Verify staff allocation percentage</li>
                  <li>• Review hardware depreciation period</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '3rem',
        paddingTop: '2rem',
        borderTop: '1px solid #e0e0e0'
      }}>
        <Button 
          kind="secondary" 
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous Step
        </Button>
        
        {currentStep < 4 ? (
          <Button 
            kind="primary" 
            renderIcon={ArrowRight}
            onClick={nextStep}
          >
            Next Step
          </Button>
        ) : (
          <Button 
            kind="primary" 
            size="lg"
            onClick={() => {
              calculateStep3();
              onComplete(profile);
            }}
          >
            Apply Configuration & View Dashboard
          </Button>
        )}
      </div>
    </div>
  );
};

export default GuidedSetup;