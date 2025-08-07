// @ts-nocheck
import React, { useState } from 'react';
import { Button, TextArea, Tag } from '@carbon/react';
import { ArrowLeft, Code, Settings, Version } from '@carbon/icons-react';
import { VM, Host, Datastore } from '../data/vmwareData';
import { CostProfile, calculateTotalCosts } from '../utils/costCalculations';

interface AdvancedModeProps {
  vms: VM[];
  hosts: Host[];
  datastores: Datastore[];
  onComplete: (profile: CostProfile) => void;
  onBack: () => void;
}

const AdvancedMode: React.FC<AdvancedModeProps> = ({ vms, hosts, datastores, onComplete, onBack }) => {
  const [activeTab, setActiveTab] = useState('formula');
  const [formula, setFormula] = useState(`// Advanced Cost Formula Builder
// Define custom cost allocation logic

function calculateVMCost(vm) {
  let baseCost = 0;
  
  // Environment-based multipliers
  const envMultiplier = {
    'Production': 1.5,
    'Development': 0.7,
    'Test': 0.5
  };
  
  // Base resource costs
  baseCost += vm.vCPU * 50;  // $50 per vCPU
  baseCost += vm.memoryGB * 10;  // $10 per GB RAM
  baseCost += vm.storageGB * 0.10;  // $0.10 per GB storage
  
  // Apply environment multiplier
  const multiplier = envMultiplier[vm.tags.environment] || 1.0;
  baseCost = baseCost * multiplier;
  
  // Department-specific overrides
  if (vm.tags.department === 'DataScience') {
    baseCost += 500;  // GPU premium
  }
  
  // Powered off discount
  if (vm.powerState === 'poweredOff') {
    baseCost = baseCost * 0.2;  // 80% discount
  }
  
  return baseCost;
}`);

  const [costProfiles, setCostProfiles] = useState([
    { name: 'v1.0 - Initial', date: '2024-07-01', active: false },
    { name: 'v2.0 - Q3 Update', date: '2024-10-01', active: false },
    { name: 'v3.0 - Current', date: '2024-08-07', active: true }
  ]);

  const applyAdvancedConfig = () => {
    // In real implementation, would parse and apply the formula
    const advancedProfile: CostProfile = {
      cpuCostPerCoreMonth: 75,  // Higher for advanced users
      memoryCostPerGBMonth: 15,
      storageCostPerGBMonth: 0.15,
      powerCoolingPerVMMonth: 40,
      softwareLicensePerVMMonth: 100
    };
    onComplete(advancedProfile);
  };

  const costs = calculateTotalCosts(vms, {
    cpuCostPerCoreMonth: 75,
    memoryCostPerGBMonth: 15,
    storageCostPerGBMonth: 0.15,
    powerCoolingPerVMMonth: 40,
    softwareLicensePerVMMonth: 100
  });

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
      
      <h1>Advanced Cost Configuration</h1>
      <p style={{ color: '#525252', marginBottom: '2rem' }}>
        Full control over cost modeling with formula builders and multi-source integration
      </p>
      
      <div style={{ marginBottom: '2rem' }}>
        <div className="cds--tabs">
          <div className="cds--tabs__nav">
            <button 
              className={`cds--tab ${activeTab === 'formula' ? 'cds--tab--selected' : ''}`}
              onClick={() => setActiveTab('formula')}
            >
              Formula Builder
            </button>
            <button 
              className={`cds--tab ${activeTab === 'departments' ? 'cds--tab--selected' : ''}`}
              onClick={() => setActiveTab('departments')}
            >
              Department Overrides
            </button>
            <button 
              className={`cds--tab ${activeTab === 'integration' ? 'cds--tab--selected' : ''}`}
              onClick={() => setActiveTab('integration')}
            >
              Integration Sources
            </button>
            <button 
              className={`cds--tab ${activeTab === 'version' ? 'cds--tab--selected' : ''}`}
              onClick={() => setActiveTab('version')}
            >
              Version Control
            </button>
          </div>
        </div>
      </div>
      
      {activeTab === 'formula' && (
        <div style={{ marginTop: '2rem' }}>
          <div className="cost-display">
            <h4>
              <Code size={20} style={{ marginRight: '0.5rem' }} />
              Custom Cost Formula
            </h4>
            <p style={{ color: '#525252', marginBottom: '1rem' }}>
              Define complex allocation rules using JavaScript
            </p>
            
            <TextArea
              labelText=""
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              rows={20}
              style={{ 
                fontFamily: 'monospace', 
                fontSize: '0.875rem',
                background: '#f4f6f8',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1rem'
              }}
            />
            
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <Button kind="secondary" size="sm">Validate Syntax</Button>
              <Button kind="secondary" size="sm">Test on Sample VM</Button>
              <Button kind="tertiary" size="sm">Load Template</Button>
            </div>
            
            <div style={{ 
              marginTop: '2rem', 
              padding: '1.5rem', 
              background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
              borderRadius: '10px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#525252' }}>Formula Result Preview:</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea', marginTop: '0.5rem' }}>
                ${costs.totalMonthly.toLocaleString()}/month
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'departments' && (
        <div style={{ marginTop: '2rem' }}>
          <div className="cost-display">
            <h4>Department-Specific Cost Profiles</h4>
            <p style={{ color: '#525252', marginBottom: '2rem' }}>
              Override base rates for specific departments
            </p>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ 
                padding: '1.5rem', 
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                background: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>Engineering</strong>
                    <div style={{ fontSize: '0.875rem', color: '#525252', marginTop: '0.5rem' }}>
                      Development and test environments
                    </div>
                  </div>
                  <div>
                    <span className="tag development">-30% base rate</span>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                padding: '1.5rem', 
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                background: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>DataScience</strong>
                    <div style={{ fontSize: '0.875rem', color: '#525252', marginTop: '0.5rem' }}>
                      GPU-enabled workloads
                    </div>
                  </div>
                  <div>
                    <span className="tag" style={{ background: 'linear-gradient(135deg, #f687b3 0%, #d53f8c 100%)', color: 'white' }}>
                      +$500/VM GPU cost
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                padding: '1.5rem', 
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                background: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>Marketing</strong>
                    <div style={{ fontSize: '0.875rem', color: '#525252', marginTop: '0.5rem' }}>
                      Production web services
                    </div>
                  </div>
                  <div>
                    <span className="tag" style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: 'white' }}>
                      Standard rates
                    </span>
                  </div>
                </div>
              </div>
              
              <Button kind="tertiary" size="sm" style={{ marginTop: '1rem' }}>
                + Add Department Override
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'integration' && (
        <div style={{ marginTop: '2rem' }}>
          <div className="cost-display">
            <h4>
              <Settings size={20} style={{ marginRight: '0.5rem' }} />
              Integration Sources
            </h4>
            <p style={{ color: '#525252', marginBottom: '2rem' }}>
              Configure external data sources for cost information
            </p>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ 
                padding: '1.5rem', 
                border: '3px solid #667eea',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f0f4ff 0%, #e6edff 100%)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>ServiceNow CMDB</strong>
                  <span className="tag" style={{ background: '#48bb78', color: 'white' }}>Connected</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#525252' }}>
                  Hardware assets, purchase orders, depreciation schedules
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#667eea' }}>
                  Last sync: 2024-08-07 09:15 AM
                </div>
              </div>
              
              <div style={{ 
                padding: '1.5rem', 
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                background: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>SAP Financial System</strong>
                  <span className="tag" style={{ background: '#cbd5e0', color: '#2d3748' }}>Not Connected</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#525252' }}>
                  Cost centers, GL accounts, monthly actuals
                </div>
                <Button kind="tertiary" size="sm" style={{ marginTop: '1rem' }}>
                  Configure Connection
                </Button>
              </div>
              
              <div style={{ 
                padding: '1.5rem', 
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                background: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>Microsoft EA Portal</strong>
                  <span className="tag" style={{ background: '#cbd5e0', color: '#2d3748' }}>Not Connected</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#525252' }}>
                  Software licensing, true-up costs
                </div>
                <Button kind="tertiary" size="sm" style={{ marginTop: '1rem' }}>
                  Configure Connection
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'version' && (
        <div style={{ marginTop: '2rem' }}>
          <div className="cost-display">
            <h4>
              <Version size={20} style={{ marginRight: '0.5rem' }} />
              Cost Model Version History
            </h4>
            <p style={{ color: '#525252', marginBottom: '2rem' }}>
              Track changes and rollback if needed
            </p>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {costProfiles.map((profile, index) => (
                <div key={index} style={{ 
                  padding: '1.5rem', 
                  border: profile.active ? '3px solid #667eea' : '2px solid #e2e8f0',
                  borderRadius: '10px',
                  background: profile.active ? 'linear-gradient(135deg, #f0f4ff 0%, #e6edff 100%)' : 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '1.1rem' }}>{profile.name}</strong>
                      <div style={{ fontSize: '0.875rem', color: '#525252', marginTop: '0.5rem' }}>
                        Modified: {profile.date}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {profile.active && <span className="tag" style={{ background: '#667eea', color: 'white' }}>Active</span>}
                      <Button kind="ghost" size="sm">View</Button>
                      {!profile.active && <Button kind="ghost" size="sm">Restore</Button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button kind="tertiary" size="sm" style={{ marginTop: '1rem' }}>
              Export Configuration
            </Button>
          </div>
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        marginTop: '3rem',
        paddingTop: '2rem',
        borderTop: '2px solid #e2e8f0'
      }}>
        <Button 
          kind="primary" 
          size="lg"
          onClick={applyAdvancedConfig}
        >
          Apply Advanced Configuration
        </Button>
      </div>
    </div>
  );
};

export default AdvancedMode;