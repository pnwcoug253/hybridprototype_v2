// src/components/CostStitching.tsx
// @ts-nocheck
import React, { useState } from 'react';
import { Button, Tag, Dropdown, Toggle, TextInput } from '@carbon/react';
import { 
  Link, 
  DataTable, 
  Rule, 
  Chemistry, 
  Checkmark,
  Warning,
  ArrowRight,
  Download,
  Upload
} from '@carbon/icons-react';

interface CostStitchingProps {
  vms: any[];
  costProfile: any;
  onComplete: (enrichedData: any) => void;
  onBack: () => void;
}

const CostStitching: React.FC<CostStitchingProps> = ({ vms, costProfile, onComplete, onBack }) => {
  const [stitchingMethod, setStitchingMethod] = useState('');
  const [mappingRules, setMappingRules] = useState([]);
  const [previewData, setPreviewData] = useState([]);

  const stitchingMethods = [
    {
      id: 'direct-enrichment',
      title: 'Direct Enrichment',
      description: 'Add cost columns directly to FOCUS-mapped data during transformation',
      icon: DataTable,
      approach: 'realtime',
      complexity: 'Simple'
    },
    {
      id: 'lookup-table',
      title: 'Lookup Table Join',
      description: 'Create cost lookup tables that join with resource IDs',
      icon: Link,
      approach: 'batch',
      complexity: 'Medium'
    },
    {
      id: 'tag-based',
      title: 'Tag-Based Attribution',
      description: 'Use resource tags to match cost allocation rules',
      icon: Rule,
      approach: 'rules',
      complexity: 'Advanced'
    },
    {
      id: 'formula-engine',
      title: 'Formula Engine',
      description: 'Apply cost formulas dynamically based on resource attributes',
      icon: Chemistry,
      approach: 'dynamic',
      complexity: 'Complex'
    }
  ];

  const renderDirectEnrichment = () => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
    }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Direct Cost Enrichment Pipeline</h3>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
        borderRadius: '10px',
        marginBottom: '2rem'
      }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <Upload size={32} style={{ color: '#667eea', marginBottom: '0.5rem' }} />
          <div style={{ fontWeight: '600' }}>Resource Data</div>
          <div style={{ fontSize: '0.75rem', color: '#718096' }}>vCenter API</div>
        </div>
        
        <ArrowRight size={24} style={{ color: '#667eea', margin: '0 1rem' }} />
        
        <div style={{ textAlign: 'center', flex: 1 }}>
          <Chemistry size={32} style={{ color: '#667eea', marginBottom: '0.5rem' }} />
          <div style={{ fontWeight: '600' }}>Cost Enrichment</div>
          <div style={{ fontSize: '0.75rem', color: '#718096' }}>Apply Profiles</div>
        </div>
        
        <ArrowRight size={24} style={{ color: '#667eea', margin: '0 1rem' }} />
        
        <div style={{ textAlign: 'center', flex: 1 }}>
          <DataTable size={32} style={{ color: '#667eea', marginBottom: '0.5rem' }} />
          <div style={{ fontWeight: '600' }}>FOCUS Format</div>
          <div style={{ fontSize: '0.75rem', color: '#718096' }}>With Costs</div>
        </div>
      </div>

      <h4 style={{ marginBottom: '1rem' }}>Enrichment Rules</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
          padding: '1rem',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          background: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>CPU Cost Calculation</strong>
              <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>
                <code>BilledCost = vCPU * ${costProfile.cpuCostPerCoreMonth}/month</code>
              </div>
            </div>
            <Tag type="green">Active</Tag>
          </div>
        </div>

        <div style={{
          padding: '1rem',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          background: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Memory Cost Calculation</strong>
              <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>
                <code>BilledCost += memoryGB * ${costProfile.memoryCostPerGBMonth}/month</code>
              </div>
            </div>
            <Tag type="green">Active</Tag>
          </div>
        </div>

        <div style={{
          padding: '1rem',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          background: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Storage Cost Calculation</strong>
              <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>
                <code>BilledCost += storageGB * ${costProfile.storageCostPerGBMonth}/month</code>
              </div>
            </div>
            <Tag type="green">Active</Tag>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: '#f0f9ff',
        borderLeft: '4px solid #0284c7',
        borderRadius: '8px'
      }}>
        <strong>Integration Code Example:</strong>
        <pre style={{
          marginTop: '0.5rem',
          padding: '1rem',
          background: '#1a202c',
          color: '#10b981',
          borderRadius: '4px',
          fontSize: '0.875rem',
          overflow: 'auto'
        }}>
{`// In your FOCUS mapper transformation
const enrichWithCosts = (resourceData, costProfile) => {
  return resourceData.map(resource => ({
    ...resource,
    // FOCUS standard cost fields
    BilledCost: calculateResourceCost(resource, costProfile),
    BillingCurrency: 'USD',
    BillingPeriodStart: new Date().toISOString(),
    BillingPeriodEnd: new Date().toISOString(),
    ChargeCategory: 'Usage',
    ChargeClass: 'Consumed',
    ChargeFrequency: 'Usage-Based',
    ChargeType: 'Usage',
    
    // Custom cost breakdown
    x_CPUCost: resource.vCPU * costProfile.cpuCostPerCoreMonth,
    x_MemoryCost: resource.memoryGB * costProfile.memoryCostPerGBMonth,
    x_StorageCost: resource.storageGB * costProfile.storageCostPerGBMonth,
    x_OpExCost: costProfile.powerCoolingPerVMMonth,
    x_LicenseCost: costProfile.softwareLicensePerVMMonth
  }));
};`}
        </pre>
      </div>
    </div>
  );

  const renderLookupTable = () => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
    }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Lookup Table Cost Join</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Cost Lookup Table</h4>
          <table style={{ width: '100%', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Resource Pattern</th>
                <th style={{ padding: '0.5rem', textAlign: 'right' }}>Monthly Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.5rem' }}>vCPU-*</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>${costProfile.cpuCostPerCoreMonth}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.5rem' }}>RAM-GB-*</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>${costProfile.memoryCostPerGBMonth}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.5rem' }}>STORAGE-GB-*</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>${costProfile.storageCostPerGBMonth}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem' }}>Join Configuration</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem', color: '#718096' }}>Join Key</label>
              <Dropdown
                items={['ResourceId', 'ResourceName', 'Custom Tag']}
                selectedItem="ResourceId"
                style={{ marginTop: '0.5rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', color: '#718096' }}>Match Type</label>
              <Dropdown
                items={['Exact Match', 'Pattern Match', 'Regex']}
                selectedItem="Exact Match"
                style={{ marginTop: '0.5rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', color: '#718096' }}>Aggregation</label>
              <Dropdown
                items={['Sum', 'Average', 'Max', 'Custom']}
                selectedItem="Sum"
                style={{ marginTop: '0.5rem' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: '#fff3cd',
        borderLeft: '4px solid #ffc107',
        borderRadius: '4px'
      }}>
        <strong>CSV Export Format:</strong>
        <pre style={{
          marginTop: '0.5rem',
          padding: '0.5rem',
          background: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '0.75rem'
        }}>
{`ResourceId,ResourceType,Quantity,UnitCost,TotalCost
vm-001-cpu,vCPU,4,50,200
vm-001-memory,RAM,16,10,160
vm-001-storage,Storage,100,0.1,10`}
        </pre>
      </div>
    </div>
  );

  const renderTagBased = () => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
    }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Tag-Based Cost Attribution</h3>
      
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>Cost Allocation Rules</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            padding: '1rem',
            border: '2px solid #667eea',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>Production Environment</strong>
              <Tag type="red">High Priority</Tag>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>
              IF tags.environment = "Production" THEN multiply_cost(1.5)
            </div>
          </div>

          <div style={{
            padding: '1rem',
            border: '2px solid #e2e8f0',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>Development Environment</strong>
              <Tag type="blue">Standard</Tag>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>
              IF tags.environment = "Development" THEN multiply_cost(0.7)
            </div>
          </div>

          <div style={{
            padding: '1rem',
            border: '2px solid #e2e8f0',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>Department Allocation</strong>
              <Tag type="green">Active</Tag>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>
              IF tags.department EXISTS THEN allocate_to_cost_center(tags.department)
            </div>
          </div>
        </div>
      </div>

      <Button
        kind="tertiary"
        size="sm"
        style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: 'none',
          color: 'white'
        }}
      >
        + Add Allocation Rule
      </Button>
    </div>
  );

  const renderFormulaEngine = () => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
    }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Dynamic Formula Engine</h3>
      
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>Cost Formula Builder</h4>
        <textarea
          style={{
            width: '100%',
            height: '200px',
            padding: '1rem',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.875rem'
          }}
          defaultValue={`// Dynamic cost calculation formula
function calculateCost(resource, profile) {
  let baseCost = 0;
  
  // Base infrastructure cost
  baseCost += resource.vCPU * profile.cpuCostPerCoreMonth;
  baseCost += resource.memoryGB * profile.memoryCostPerGBMonth;
  baseCost += resource.storageGB * profile.storageCostPerGBMonth;
  
  // Apply environment multiplier
  const envMultiplier = {
    'Production': 1.5,
    'Development': 0.7,
    'Test': 0.8
  };
  baseCost *= envMultiplier[resource.tags.environment] || 1;
  
  // Add fixed costs
  baseCost += profile.powerCoolingPerVMMonth;
  baseCost += profile.softwareLicensePerVMMonth;
  
  // Apply utilization-based discount
  if (resource.cpuUsageAvg < 20) {
    baseCost *= 0.8; // 20% discount for underutilized
  }
  
  return baseCost;
}`}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button kind="secondary" size="sm">Validate Syntax</Button>
        <Button kind="secondary" size="sm">Test Formula</Button>
        <Button kind="primary" size="sm">Save Formula</Button>
      </div>
    </div>
  );

  return (
    <div className="main-content">
      <h1>Cost Data Stitching</h1>
      <p style={{ color: '#525252', marginBottom: '2rem' }}>
        Connect your cost profiles to resource inventory data
      </p>

      <div style={{
        background: '#f0f9ff',
        borderLeft: '4px solid #0284c7',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '2rem'
      }}>
        <strong>Current Pipeline Status:</strong>
        <div style={{ marginTop: '0.5rem' }}>
          ✅ Resource inventory connected (vCenter API) → 
          ✅ Data mapped to FOCUS format → 
          ⚠️ Cost enrichment needed
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Select Stitching Method</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stitchingMethods.map((method) => {
          const Icon = method.icon;
          return (
            <div
              key={method.id}
              onClick={() => setStitchingMethod(method.id)}
              style={{
                background: stitchingMethod === method.id 
                  ? 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)'
                  : 'white',
                border: stitchingMethod === method.id 
                  ? '2px solid #667eea'
                  : '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Icon size={24} style={{ color: '#667eea' }} />
                <Tag type={
                  method.complexity === 'Simple' ? 'green' :
                  method.complexity === 'Medium' ? 'blue' :
                  method.complexity === 'Advanced' ? 'purple' : 'gray'
                } size="sm">
                  {method.complexity}
                </Tag>
              </div>
              <h4 style={{ marginTop: '1rem' }}>{method.title}</h4>
              <p style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
                {method.description}
              </p>
            </div>
          );
        })}
      </div>

      {stitchingMethod === 'direct-enrichment' && renderDirectEnrichment()}
      {stitchingMethod === 'lookup-table' && renderLookupTable()}
      {stitchingMethod === 'tag-based' && renderTagBased()}
      {stitchingMethod === 'formula-engine' && renderFormulaEngine()}

      {stitchingMethod && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Preview Enriched Data</h3>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
            overflow: 'auto'
          }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>ResourceId</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>ResourceName</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>vCPU</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Memory</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>BilledCost</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>ChargeType</th>
                </tr>
              </thead>
              <tbody>
                {vms.slice(0, 5).map(vm => {
                  const cost = 
                    (vm.vCPU * costProfile.cpuCostPerCoreMonth) +
                    (vm.memoryGB * costProfile.memoryCostPerGBMonth) +
                    (vm.storageGB * costProfile.storageCostPerGBMonth) +
                    costProfile.powerCoolingPerVMMonth +
                    costProfile.softwareLicensePerVMMonth;
                  
                  return (
                    <tr key={vm.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.75rem' }}>{vm.id}</td>
                      <td style={{ padding: '0.75rem' }}>{vm.name}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{vm.vCPU}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{vm.memoryGB}GB</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600', color: '#667eea' }}>
                        ${cost.toFixed(2)}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <Tag type="green" size="sm">Usage</Tag>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Button
              kind="secondary"
              renderIcon={Download}
              style={{ flex: 1 }}
            >
              Export FOCUS CSV
            </Button>
            <Button
              kind="primary"
              renderIcon={ArrowRight}
              onClick={() => onComplete(previewData)}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
            >
              Apply to Pipeline
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostStitching;