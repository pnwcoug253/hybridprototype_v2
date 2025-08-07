import React, { useState } from 'react';
import { Button, Slider } from '@carbon/react';
import { ArrowLeft, Checkmark, Information } from '@carbon/icons-react';
import { VM } from '../data/vmwareData';
import { CostProfile, defaultCostProfile, calculateTotalCosts } from '../utils/costCalculations';

interface QuickStartProps {
  vms: VM[];
  onComplete: (profile: CostProfile) => void;
  onBack: () => void;
}

const QuickStart: React.FC<QuickStartProps> = ({ vms, onComplete, onBack }) => {
  const [adjustment, setAdjustment] = useState(0);
  
  const adjustedProfile: CostProfile = {
    cpuCostPerCoreMonth: defaultCostProfile.cpuCostPerCoreMonth * (1 + adjustment / 100),
    memoryCostPerGBMonth: defaultCostProfile.memoryCostPerGBMonth * (1 + adjustment / 100),
    storageCostPerGBMonth: defaultCostProfile.storageCostPerGBMonth * (1 + adjustment / 100),
    powerCoolingPerVMMonth: defaultCostProfile.powerCoolingPerVMMonth * (1 + adjustment / 100),
    softwareLicensePerVMMonth: defaultCostProfile.softwareLicensePerVMMonth * (1 + adjustment / 100)
  };
  
  const costs = calculateTotalCosts(vms, adjustedProfile);
  
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
      
      <h1>Quick Start Configuration</h1>
      <p style={{ color: '#525252', marginBottom: '2rem' }}>
        We've applied industry-standard rates to your infrastructure. Adjust if needed.
      </p>
      
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: '100%' }}></div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div>
          <div className="cost-display">
            <h4>
              <Checkmark size={20} style={{ color: '#24a148', marginRight: '0.5rem' }} />
              Auto-Detected Configuration
            </h4>
            <div className="cost-metrics">
              <div className="metric">
                <div className="metric-label">Virtual Machines</div>
                <div className="metric-value">{vms.length}</div>
              </div>
              <div className="metric">
                <div className="metric-label">Total vCPUs</div>
                <div className="metric-value">
                  {vms.reduce((sum, vm) => sum + vm.vCPU, 0)}
                </div>
              </div>
              <div className="metric">
                <div className="metric-label">Total Memory</div>
                <div className="metric-value">
                  {vms.reduce((sum, vm) => sum + vm.memoryGB, 0)} GB
                </div>
              </div>
              <div className="metric">
                <div className="metric-label">Total Storage</div>
                <div className="metric-value">
                  {(vms.reduce((sum, vm) => sum + vm.storageGB, 0) / 1000).toFixed(1)} TB
                </div>
              </div>
            </div>
          </div>
          
          <div className="slider-container">
            <label>
              <Information size={16} style={{ marginRight: '0.5rem' }} />
              Regional Cost Adjustment
            </label>
            <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '1rem' }}>
              Adjust based on your region's cost differences
            </p>
            <Slider
              id="cost-adjustment"
              min={-30}
              max={50}
              value={adjustment}
              onChange={({ value }) => setAdjustment(value)}
              labelText=""
              stepMultiplier={5}
            />
            <div className="slider-values">
              <span>-30% (Low cost region)</span>
              <span style={{ fontWeight: 'bold' }}>{adjustment > 0 ? '+' : ''}{adjustment}%</span>
              <span>+50% (High cost region)</span>
            </div>
          </div>
        </div>
        
        <div>
          <div className="cost-display">
            <h4>Default Rates (Monthly)</h4>
            <table style={{ width: '100%', marginTop: '1rem' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '0.5rem 0', color: '#525252' }}>Per vCPU:</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    ${adjustedProfile.cpuCostPerCoreMonth.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0', color: '#525252' }}>Per GB Memory:</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    ${adjustedProfile.memoryCostPerGBMonth.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0', color: '#525252' }}>Per GB Storage:</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    ${adjustedProfile.storageCostPerGBMonth.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0', color: '#525252' }}>Power & Cooling per VM:</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    ${adjustedProfile.powerCoolingPerVMMonth.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0', color: '#525252' }}>Software Licenses per VM:</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    ${adjustedProfile.softwareLicensePerVMMonth.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div style={{ 
              marginTop: '1.5rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid #e0e0e0' 
            }}>
              <div style={{ fontSize: '0.875rem', color: '#525252' }}>
                Estimated Monthly Cost
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f62fe' }}>
                ${costs.totalMonthly.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#525252' }}>
                ${costs.totalDaily.toFixed(0)}/day
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '3rem',
        paddingTop: '2rem',
        borderTop: '1px solid #e0e0e0'
      }}>
        <div>
          <p style={{ color: '#525252', fontSize: '0.875rem' }}>
            <Information size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            You can refine these rates later in Settings
          </p>
        </div>
        <Button 
          kind="primary" 
          size="lg"
          renderIcon={ArrowLeft}
          onClick={() => onComplete(adjustedProfile)}
        >
          Apply Configuration & View Dashboard
        </Button>
      </div>
    </div>
  );
};

export default QuickStart;