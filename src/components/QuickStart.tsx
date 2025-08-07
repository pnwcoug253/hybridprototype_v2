// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@carbon/react';
import { ArrowLeft, Checkmark, Information, ArrowRight } from '@carbon/icons-react';
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
  
  const handleSliderChange = (e) => {
    setAdjustment(parseInt(e.target.value));
  };
  
  return (
    <div className="main-content">
      <Button 
        kind="ghost" 
        size="sm" 
        renderIcon={ArrowLeft}
        onClick={onBack}
        style={{ 
          marginBottom: '2rem',
          padding: '0.5rem 1rem',
          borderRadius: '8px'
        }}
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
          <div className="cost-display" style={{ 
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
          }}>
            <h4 style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <Checkmark size={20} style={{ color: '#48bb78', marginRight: '0.5rem' }} />
              Auto-Detected Configuration
            </h4>
            <div className="cost-metrics">
              <div className="metric" style={{ 
                background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
                borderRadius: '10px',
                padding: '1rem'
              }}>
                <div className="metric-label">Virtual Machines</div>
                <div className="metric-value" style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '2rem',
                  fontWeight: '700'
                }}>{vms.length}</div>
              </div>
              <div className="metric" style={{ 
                background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
                borderRadius: '10px',
                padding: '1rem'
              }}>
                <div className="metric-label">Total vCPUs</div>
                <div className="metric-value" style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '2rem',
                  fontWeight: '700'
                }}>
                  {vms.reduce((sum, vm) => sum + vm.vCPU, 0)}
                </div>
              </div>
              <div className="metric" style={{ 
                background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
                borderRadius: '10px',
                padding: '1rem'
              }}>
                <div className="metric-label">Total Memory</div>
                <div className="metric-value" style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '2rem',
                  fontWeight: '700'
                }}>
                  {vms.reduce((sum, vm) => sum + vm.memoryGB, 0)} GB
                </div>
              </div>
              <div className="metric" style={{ 
                background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
                borderRadius: '10px',
                padding: '1rem'
              }}>
                <div className="metric-label">Total Storage</div>
                <div className="metric-value" style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '2rem',
                  fontWeight: '700'
                }}>
                  {(vms.reduce((sum, vm) => sum + vm.storageGB, 0) / 1000).toFixed(1)} TB
                </div>
              </div>
            </div>
          </div>
          
          <div className="slider-container" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
            marginTop: '2rem'
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '1rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              <Information size={16} style={{ marginRight: '0.5rem', color: '#667eea' }} />
              Regional Cost Adjustment
            </label>
            <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '1.5rem' }}>
              Adjust based on your region's cost differences
            </p>
            
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
              <input
                type="range"
                min="-30"
                max="50"
                value={adjustment}
                onChange={handleSliderChange}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '5px',
                  background: `linear-gradient(to right, 
                    #667eea 0%, 
                    #667eea ${((adjustment + 30) / 80) * 100}%, 
                    #e2e8f0 ${((adjustment + 30) / 80) * 100}%, 
                    #e2e8f0 100%)`,
                  outline: 'none',
                  WebkitAppearance: 'none',
                  cursor: 'pointer'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '-30px',
                left: `${((adjustment + 30) / 80) * 100}%`,
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
              }}>
                {adjustment > 0 ? '+' : ''}{adjustment}%
              </div>
            </div>
            
            <div className="slider-values" style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#718096',
              fontSize: '0.75rem'
            }}>
              <span>-30% (Low cost region)</span>
              <span>0%</span>
              <span>+50% (High cost region)</span>
            </div>
          </div>
        </div>
        
        <div>
          <div className="cost-display" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
          }}>
            <h4 style={{ marginBottom: '1.5rem', color: '#2d3748' }}>Default Rates (Monthly)</h4>
            <table style={{ width: '100%', marginTop: '1rem' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '0.75rem 0', color: '#718096' }}>Per vCPU:</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    ${adjustedProfile.cpuCostPerCoreMonth.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem 0', color: '#718096' }}>Per GB Memory:</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    ${adjustedProfile.memoryCostPerGBMonth.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem 0', color: '#718096' }}>Per GB Storage:</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    ${adjustedProfile.storageCostPerGBMonth.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem 0', color: '#718096' }}>Power & Cooling per VM:</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    ${adjustedProfile.powerCoolingPerVMMonth.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem 0', color: '#718096' }}>Software Licenses per VM:</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    ${adjustedProfile.softwareLicensePerVMMonth.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div style={{ 
              marginTop: '2rem', 
              paddingTop: '2rem', 
              borderTop: '2px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>
                Estimated Monthly Cost
              </div>
              <div style={{ 
                fontSize: '3rem', 
                fontWeight: '800',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ${costs.totalMonthly.toLocaleString()}
              </div>
              <div style={{ fontSize: '1rem', color: '#718096' }}>
                ${costs.totalDaily.toFixed(0)}/day
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: '3rem',
        paddingTop: '2rem',
        borderTop: '2px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Information size={16} style={{ marginRight: '0.5rem', color: '#718096' }} />
          <p style={{ color: '#718096', fontSize: '0.875rem' }}>
            You can refine these rates later in Settings
          </p>
        </div>
        <Button 
          kind="primary" 
          size="lg"
          renderIcon={ArrowRight}
          onClick={() => onComplete(adjustedProfile)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            cursor: 'pointer'
          }}
        >
          Apply Configuration & View Dashboard
        </Button>
      </div>
    </div>
  );
};

export default QuickStart;