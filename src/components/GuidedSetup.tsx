// @ts-nocheck
import React, { useState } from 'react';
import { Button, TextInput, NumberInput, RadioButton, RadioButtonGroup, Dropdown } from '@carbon/react';
import { ArrowLeft, ArrowRight, Calculator, Cloud, Information, ChevronLeft, ChevronRight } from '@carbon/icons-react';
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
        style={{ 
          marginBottom: '2rem',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: '2px solid #667eea',
          color: '#667eea'
        }}
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
      
      <div className="progress-bar" style={{ 
        background: '#e2e8f0',
        height: '8px',
        borderRadius: '10px',
        marginBottom: '2rem'
      }}>
        <div className="progress-fill" style={{ 
          width: `${(currentStep / 4) * 100}%`,
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          height: '100%',
          borderRadius: '10px',
          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}></div>
      </div>
      
      {currentStep === 1 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Step 1: Hardware Costs</h2>
          <p style={{ color: '#525252', marginBottom: '2rem' }}>
            Configure how your hardware purchase costs are allocated
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="cost-display" style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
            }}>
              <h4 style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <Calculator size={20} style={{ marginRight: '0.5rem', color: '#667eea' }} />
                Depreciation Calculator
              </h4>
              
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#4a5568',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Total Hardware Investment
                </label>
                <input
                  type="number"
                  value={totalHardwareCost}
                  onChange={(e) => setTotalHardwareCost(parseInt(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.3s'
                  }}
                />
                <p style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.5rem' }}>
                  Combined purchase price of all servers
                </p>
                
                <div style={{ marginTop: '2rem' }}>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '1rem',
                    color: '#4a5568',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Depreciation Period
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="depreciation"
                        value="3"
                        checked={depreciationYears === 3}
                        onChange={(e) => setDepreciationYears(3)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      <span>3 years</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="depreciation"
                        value="5"
                        checked={depreciationYears === 5}
                        onChange={(e) => setDepreciationYears(5)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      <span>5 years (Recommended)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="depreciation"
                        value="7"
                        checked={depreciationYears === 7}
                        onChange={(e) => setDepreciationYears(7)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      <span>7 years</span>
                    </label>
                  </div>
                </div>
                
                <div style={{ 
                  marginTop: '2rem', 
                  padding: '1.5rem', 
                  background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#718096' }}>Monthly Hardware Cost:</div>
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginTop: '0.5rem'
                  }}>
                    ${(totalHardwareCost / (depreciationYears * 12)).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="cost-display" style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
            }}>
              <h4>Detected Hardware</h4>
              <table style={{ width: '100%', marginTop: '1rem' }}>
                <thead>
                  <tr>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '0.75rem 0', 
                      color: '#718096',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderBottom: '2px solid #e2e8f0'
                    }}>Host</th>
                    <th style={{ 
                      textAlign: 'right', 
                      padding: '0.75rem 0', 
                      color: '#718096',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderBottom: '2px solid #e2e8f0'
                    }}>Cores</th>
                    <th style={{ 
                      textAlign: 'right', 
                      padding: '0.75rem 0', 
                      color: '#718096',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderBottom: '2px solid #e2e8f0'
                    }}>Memory</th>
                    <th style={{ 
                      textAlign: 'right', 
                      padding: '0.75rem 0', 
                      color: '#718096',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderBottom: '2px solid #e2e8f0'
                    }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {hosts.map(host => (
                    <tr key={host.id}>
                      <td style={{ padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
                        {host.name.split('.')[0]}
                      </td>
                      <td style={{ textAlign: 'right', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
                        {host.cpuCores}
                      </td>
                      <td style={{ textAlign: 'right', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
                        {host.memoryGB}GB
                      </td>
                      <td style={{ textAlign: 'right', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0', fontWeight: '600' }}>
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
      
      {/* Similar improvements for steps 2, 3, and 4... */}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '3rem',
        paddingTop: '2rem',
        borderTop: '2px solid #e2e8f0'
      }}>
        <Button 
          kind="secondary" 
          onClick={prevStep}
          disabled={currentStep === 1}
          renderIcon={ChevronLeft}
          style={{
            background: currentStep === 1 ? '#e2e8f0' : 'white',
            color: currentStep === 1 ? '#a0aec0' : '#667eea',
            border: currentStep === 1 ? 'none' : '2px solid #667eea',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s'
          }}
        >
          Previous Step
        </Button>
        
        {currentStep < 4 ? (
          <Button 
            kind="primary" 
            renderIcon={ChevronRight}
            onClick={nextStep}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Next Step
          </Button>
        ) : (
          <Button 
            kind="primary" 
            size="lg"
            renderIcon={ArrowRight}
            onClick={() => {
              calculateStep3();
              onComplete(profile);
            }}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              padding: '1rem 2.5rem',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: '600',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s'
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