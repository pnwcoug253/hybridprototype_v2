export interface VM {
  id: string;
  name: string;
  vCPU: number;
  memoryGB: number;
  storageGB: number;
  powerState: 'poweredOn' | 'poweredOff' | 'suspended';
  esxiHost: string;
  datastore: string;
  tags: {
    environment?: string;
    department?: string;
    application?: string;
    owner?: string;
  };
  cpuUsageAvg: number;
  memoryUsageAvg: number;
  createdDate: string;
  lastPoweredOn?: string;
}

export interface Host {
  id: string;
  name: string;
  cpuCores: number;
  memoryGB: number;
  purchaseDate: string;
  purchasePrice: number;
}

export interface Datastore {
  id: string;
  name: string;
  capacityGB: number;
  type: 'SSD' | 'HDD' | 'Archive';
  costPerGBMonth: number;
}

export const vmwareVMs: VM[] = [
  {
    id: 'vm-001',
    name: 'PROD-WEB-001',
    vCPU: 4,
    memoryGB: 16,
    storageGB: 100,
    powerState: 'poweredOn',
    esxiHost: 'esxi-prod-01',
    datastore: 'SSD-Datastore-01',
    tags: {
      environment: 'Production',
      department: 'Marketing',
      application: 'Corporate Website',
      owner: 'TeamAlpha'
    },
    cpuUsageAvg: 45,
    memoryUsageAvg: 78,
    createdDate: '2023-01-15',
    lastPoweredOn: '2024-08-01'
  },
  {
    id: 'vm-002',
    name: 'PROD-API-001',
    vCPU: 8,
    memoryGB: 32,
    storageGB: 200,
    powerState: 'poweredOn',
    esxiHost: 'esxi-prod-01',
    datastore: 'SSD-Datastore-01',
    tags: {
      environment: 'Production',
      department: 'Engineering',
      application: 'Customer API',
      owner: 'TeamBeta'
    },
    cpuUsageAvg: 67,
    memoryUsageAvg: 72,
    createdDate: '2022-11-20',
    lastPoweredOn: '2024-08-01'
  },
  {
    id: 'vm-003',
    name: 'PROD-DB-001',
    vCPU: 32,
    memoryGB: 128,
    storageGB: 2000,
    powerState: 'poweredOn',
    esxiHost: 'esxi-prod-01',
    datastore: 'SSD-Datastore-01',
    tags: {
      environment: 'Production',
      department: 'IT',
      application: 'Oracle Database',
      owner: 'DBATeam'
    },
    cpuUsageAvg: 12,
    memoryUsageAvg: 35,
    createdDate: '2021-06-15',
    lastPoweredOn: '2024-08-01'
  },
  {
    id: 'vm-004',
    name: 'DEV-APP-001',
    vCPU: 2,
    memoryGB: 8,
    storageGB: 100,
    powerState: 'poweredOn',
    esxiHost: 'esxi-dev-01',
    datastore: 'HDD-Datastore-01',
    tags: {
      environment: 'Development',
      department: 'Engineering',
      application: 'Dev Environment',
      owner: 'TeamGamma'
    },
    cpuUsageAvg: 35,
    memoryUsageAvg: 62,
    createdDate: '2023-08-15',
    lastPoweredOn: '2024-08-05'
  },
  {
    id: 'vm-005',
    name: 'DEV-APP-002',
    vCPU: 2,
    memoryGB: 8,
    storageGB: 100,
    powerState: 'poweredOff',
    esxiHost: 'esxi-dev-01',
    datastore: 'HDD-Datastore-01',
    tags: {
      environment: 'Development',
      department: 'Engineering',
      application: 'Dev Environment',
      owner: 'TeamGamma'
    },
    cpuUsageAvg: 0,
    memoryUsageAvg: 0,
    createdDate: '2023-07-20',
    lastPoweredOn: '2024-06-15'
  },
  {
    id: 'vm-006',
    name: 'TEST-AUTOMATION-001',
    vCPU: 4,
    memoryGB: 16,
    storageGB: 200,
    powerState: 'poweredOn',
    esxiHost: 'esxi-dev-02',
    datastore: 'HDD-Datastore-01',
    tags: {
      environment: 'Test',
      department: 'QA',
      application: 'Selenium Grid',
      owner: 'QATeam'
    },
    cpuUsageAvg: 62,
    memoryUsageAvg: 55,
    createdDate: '2023-09-01',
    lastPoweredOn: '2024-08-04'
  },
  {
    id: 'vm-007',
    name: 'OLD-APP-BACKUP',
    vCPU: 4,
    memoryGB: 16,
    storageGB: 500,
    powerState: 'poweredOn',
    esxiHost: 'esxi-dev-01',
    datastore: 'Archive-Datastore-01',
    tags: {
      department: 'IT'
    },
    cpuUsageAvg: 1,
    memoryUsageAvg: 8,
    createdDate: '2021-12-01',
    lastPoweredOn: '2023-01-15'
  },
  {
    id: 'vm-008',
    name: 'TEMP-MIGRATION-03',
    vCPU: 2,
    memoryGB: 8,
    storageGB: 200,
    powerState: 'poweredOn',
    esxiHost: 'esxi-dev-02',
    datastore: 'Archive-Datastore-01',
    tags: {},
    cpuUsageAvg: 2,
    memoryUsageAvg: 12,
    createdDate: '2022-10-15',
    lastPoweredOn: '2023-03-01'
  },
  {
    id: 'vm-009',
    name: 'ML-TRAINING-GPU-01',
    vCPU: 16,
    memoryGB: 128,
    storageGB: 1000,
    powerState: 'poweredOn',
    esxiHost: 'esxi-gpu-01',
    datastore: 'SSD-Datastore-01',
    tags: {
      environment: 'Production',
      department: 'DataScience',
      application: 'ML Training',
      owner: 'AITeam'
    },
    cpuUsageAvg: 82,
    memoryUsageAvg: 91,
    createdDate: '2024-01-15',
    lastPoweredOn: '2024-08-05'
  },
  {
    id: 'vm-010',
    name: 'PROD-WORKER-001',
    vCPU: 4,
    memoryGB: 16,
    storageGB: 100,
    powerState: 'poweredOn',
    esxiHost: 'esxi-prod-02',
    datastore: 'HDD-Datastore-01',
    tags: {
      environment: 'Production',
      department: 'Operations',
      application: 'Background Jobs',
      owner: 'TeamDelta'
    },
    cpuUsageAvg: 58,
    memoryUsageAvg: 67,
    createdDate: '2023-06-01',
    lastPoweredOn: '2024-08-05'
  },
  {
    id: 'vm-011',
    name: 'DEV-DB-001',
    vCPU: 8,
    memoryGB: 32,
    storageGB: 500,
    powerState: 'poweredOn',
    esxiHost: 'esxi-dev-01',
    datastore: 'HDD-Datastore-01',
    tags: {
      environment: 'Development',
      department: 'Engineering',
      application: 'Dev Database',
      owner: 'TeamEpsilon'
    },
    cpuUsageAvg: 42,
    memoryUsageAvg: 58,
    createdDate: '2023-10-01',
    lastPoweredOn: '2024-08-04'
  },
  {
    id: 'vm-012',
    name: 'MONITORING-001',
    vCPU: 4,
    memoryGB: 16,
    storageGB: 200,
    powerState: 'poweredOn',
    esxiHost: 'esxi-prod-01',
    datastore: 'SSD-Datastore-01',
    tags: {
      environment: 'Production',
      department: 'IT',
      application: 'Prometheus',
      owner: 'OpsTeam'
    },
    cpuUsageAvg: 38,
    memoryUsageAvg: 76,
    createdDate: '2022-08-01',
    lastPoweredOn: '2024-08-01'
  },
  {
    id: 'vm-013',
    name: 'STAGING-WEB-001',
    vCPU: 4,
    memoryGB: 16,
    storageGB: 100,
    powerState: 'poweredOff',
    esxiHost: 'esxi-dev-02',
    datastore: 'HDD-Datastore-01',
    tags: {
      environment: 'Test',
      department: 'Engineering',
      application: 'Staging Environment',
      owner: 'TeamZeta'
    },
    cpuUsageAvg: 0,
    memoryUsageAvg: 0,
    createdDate: '2023-12-15',
    lastPoweredOn: '2024-05-01'
  },
  {
    id: 'vm-014',
    name: 'PROD-CACHE-001',
    vCPU: 4,
    memoryGB: 64,
    storageGB: 50,
    powerState: 'poweredOn',
    esxiHost: 'esxi-prod-01',
    datastore: 'SSD-Datastore-01',
    tags: {
      environment: 'Production',
      department: 'Engineering',
      application: 'Redis Cache',
      owner: 'TeamBeta'
    },
    cpuUsageAvg: 25,
    memoryUsageAvg: 89,
    createdDate: '2023-03-10',
    lastPoweredOn: '2024-08-01'
  },
  {
    id: 'vm-015',
    name: 'ANALYTICS-DB-001',
    vCPU: 16,
    memoryGB: 64,
    storageGB: 3000,
    powerState: 'poweredOn',
    esxiHost: 'esxi-prod-01',
    datastore: 'HDD-Datastore-01',
    tags: {
      environment: 'Production',
      department: 'Analytics',
      application: 'Clickhouse',
      owner: 'DataTeam'
    },
    cpuUsageAvg: 55,
    memoryUsageAvg: 71,
    createdDate: '2023-05-01',
    lastPoweredOn: '2024-08-01'
  },
  {
    id: 'vm-016',
    name: 'TEST-LOAD-001',
    vCPU: 8,
    memoryGB: 32,
    storageGB: 150,
    powerState: 'poweredOff',
    esxiHost: 'esxi-dev-02',
    datastore: 'HDD-Datastore-01',
    tags: {
      environment: 'Test',
      department: 'QA',
      application: 'Load Testing',
      owner: 'QATeam'
    },
    cpuUsageAvg: 0,
    memoryUsageAvg: 0,
    createdDate: '2023-04-15',
    lastPoweredOn: '2024-07-01'
  },
  {
    id: 'vm-017',
    name: 'LOGGING-001',
    vCPU: 8,
    memoryGB: 32,
    storageGB: 1000,
    powerState: 'poweredOn',
    esxiHost: 'esxi-prod-02',
    datastore: 'HDD-Datastore-01',
    tags: {
      environment: 'Production',
      department: 'IT',
      application: 'ELK Stack',
      owner: 'OpsTeam'
    },
    cpuUsageAvg: 45,
    memoryUsageAvg: 82,
    createdDate: '2022-09-15',
    lastPoweredOn: '2024-08-01'
  },
  {
    id: 'vm-018',
    name: 'BACKUP-SERVER-001',
    vCPU: 4,
    memoryGB: 16,
    storageGB: 100,
    powerState: 'poweredOn',
    esxiHost: 'esxi-prod-01',
    datastore: 'Archive-Datastore-01',
    tags: {
      environment: 'Production',
      department: 'IT',
      application: 'Veeam Backup',
      owner: 'InfraTeam'
    },
    cpuUsageAvg: 28,
    memoryUsageAvg: 45,
    createdDate: '2021-03-01',
    lastPoweredOn: '2024-08-01'
  },
  {
    id: 'vm-019',
    name: 'AD-CONTROLLER-002',
    vCPU: 2,
    memoryGB: 8,
    storageGB: 100,
    powerState: 'poweredOn',
    esxiHost: 'esxi-prod-02',
    datastore: 'SSD-Datastore-01',
    tags: {
      environment: 'Production',
      department: 'IT',
      application: 'Active Directory',
      owner: 'InfraTeam'
    },
    cpuUsageAvg: 15,
    memoryUsageAvg: 38,
    createdDate: '2020-01-15',
    lastPoweredOn: '2024-08-01'
  },
  {
    id: 'vm-020',
    name: 'PROD-DB-002',
    vCPU: 24,
    memoryGB: 96,
    storageGB: 1500,
    powerState: 'poweredOn',
    esxiHost: 'esxi-prod-02',
    datastore: 'SSD-Datastore-01',
    tags: {
      environment: 'Production',
      department: 'IT',
      application: 'SQL Server',
      owner: 'DBATeam'
    },
    cpuUsageAvg: 18,
    memoryUsageAvg: 42,
    createdDate: '2022-01-20',
    lastPoweredOn: '2024-08-01'
  }
];

export const vmwareHosts: Host[] = [
  {
    id: 'esxi-prod-01',
    name: 'esxi-prod-01.datacenter.local',
    cpuCores: 64,
    memoryGB: 512,
    purchaseDate: '2020-01-15',
    purchasePrice: 25000
  },
  {
    id: 'esxi-prod-02',
    name: 'esxi-prod-02.datacenter.local',
    cpuCores: 64,
    memoryGB: 512,
    purchaseDate: '2020-01-15',
    purchasePrice: 25000
  },
  {
    id: 'esxi-dev-01',
    name: 'esxi-dev-01.datacenter.local',
    cpuCores: 32,
    memoryGB: 256,
    purchaseDate: '2022-06-01',
    purchasePrice: 15000
  },
  {
    id: 'esxi-dev-02',
    name: 'esxi-dev-02.datacenter.local',
    cpuCores: 32,
    memoryGB: 256,
    purchaseDate: '2022-06-01',
    purchasePrice: 15000
  },
  {
    id: 'esxi-gpu-01',
    name: 'esxi-gpu-01.datacenter.local',
    cpuCores: 48,
    memoryGB: 384,
    purchaseDate: '2024-01-01',
    purchasePrice: 45000
  }
];

export const vmwareDatastores: Datastore[] = [
  {
    id: 'ds-001',
    name: 'SSD-Datastore-01',
    capacityGB: 10000,
    type: 'SSD',
    costPerGBMonth: 0.15
  },
  {
    id: 'ds-002',
    name: 'HDD-Datastore-01',
    capacityGB: 50000,
    type: 'HDD',
    costPerGBMonth: 0.05
  },
  {
    id: 'ds-003',
    name: 'Archive-Datastore-01',
    capacityGB: 100000,
    type: 'Archive',
    costPerGBMonth: 0.02
  }
];