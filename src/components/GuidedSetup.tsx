// src/components/GuidedSetup.tsx
// @ts-nocheck
import React, { useState } from 'react';
import { Button, TextInput, NumberInput, Tag } from '@carbon/react';
import { ArrowLeft, ArrowRight, Calculator, Cloud, Information, ChevronLeft, ChevronRight, Currency, Building, Code, CheckmarkFilled } from '@carbon/icons-react';
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
  const [totalHardwareCost, setTotalHardwareCost] = useState(hosts.reduce((sum, host) => sum + host.purchasePrice, 0));
  const [residualValue, setResidualValue] = useState(10);

  // Step 2: Operating Expenses
  const [powerCooling, setPowerCooling] = useState(5000);
  const [facilities, setFacilities] = useState(3000);
  const [networkBandwidth, setNetworkBandwidth] = useState(2000);
  const [staffAllocation, setStaffAllocation] = useState(25000);
  const [distributionMethod, setDistributionMethod] = useState('cpu');

  // Step 3: Software Licensing
  const [vmwareLicense, setVmwareLicense] = useState(3000);
  const [windowsLicense, setWindowsLicense] = useState(100);
  const [sqlLicense, setSqlLicense] = useState(500);
  const [oracleLicense, setOracleLicense] = useState(0);
  const [customLicenses, setCustomLicenses] = useState([]);

  const calculateStep1 = () => {
    const adjustedCost = totalHardwareCost * (1 - residualValue / 100);
    const monthlyHardware = adjustedCost / (depreciationYears * 12);
    const totalCores = hosts.reduce((sum, host) => sum + host.cpuCores, 0);
    const totalMemory = hosts.reduce((sum, host) => sum + host.memoryGB, 0);
    
    setProfile(prev => ({
      ...prev,
      cpuCostPerCoreMonth: monthlyHardware * 0.4 / totalCores,
      memoryCostPerGBMonth: monthlyHardware * 0.4 / totalMemory,
      storageCostPerGBMonth: monthlyHardware * 0.2 / 50000
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
    const totalSoftware = (vmwareLicense / 12) + windowsLicense + sqlLicense + oracleLicense;
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

  const renderStepIndicator = () => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
      {[1, 2, 3, 4].map((step) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: currentStep >= step 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : '#e2e8f0',
            color: currentStep >= step ? 'white' : '#718096',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '1.1rem',
            boxShadow: currentStep === step ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none',
            transition: 'all 0.3s'
          }}>
            {step}
          </div>
          {step < 4 && (
            <div style={{
              width: '60px',
              height: '2px',
              background: currentStep > step 
                ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                : '#e2e8f0',
              transition: 'all 0.3s'
            }} />
          )}
        </div>
      ))}
    </div>
  );

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

      {renderStepIndicator()}

      <div className="progress-bar" style={{
        background: '#e2e8f0',
        height: '8px',
        borderRadius: '10px',
        marginBottom: '3rem',
        overflow: 'hidden'
      }}>
        <div className="progress-fill" style={{
          width: `${(currentStep / 4) * 100}%`,
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          height: '100%',
          borderRadius: '10px',
          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
        }} />
      </div>

      {/* Step 1: Hardware Costs */}
      {currentStep === 1 && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="cost-display" style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: '#2d3748' }}>
                <Calculator size={20} style={{ marginRight: '0.5rem', color: '#667eea' }} />
                Depreciation Calculator
              </h4>
              
              <div style={{ marginBottom: '2rem' }}>
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
              </div>

              <div style={{ marginBottom: '2rem' }}>
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
                  {[3, 5, 7].map(years => (
                    <label key={years} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      padding: '0.75rem',
                      border: depreciationYears === years ? '2px solid #667eea' : '2px solid #e2e8f0',
                      borderRadius: '8px',
                      background: depreciationYears === years ? 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)' : 'white',
                      transition: 'all 0.3s'
                    }}>
                      <input
                        type="radio"
                        name="depreciation"
                        value={years}
                        checked={depreciationYears === years}
                        onChange={() => setDepreciationYears(years)}
                        style={{ marginRight: '0.75rem' }}
                      />
                      <span style={{ fontWeight: depreciationYears === years ? '600' : '400' }}>
                        {years} years {years === 5 && '(Recommended)'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#4a5568',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Residual Value: {residualValue}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={residualValue}
                  onChange={(e) => setResidualValue(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    background: `linear-gradient(to right, #667eea 0%, #667eea ${residualValue * 3.33}%, #e2e8f0 ${residualValue * 3.33}%, #e2e8f0 100%)`
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#718096', marginTop: '0.5rem' }}>
                  <span>0%</span>
                  <span>30%</span>
                </div>
              </div>

              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
                borderRadius: '10px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>Monthly Hardware Cost</div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginTop: '0.5rem'
                }}>
                  ${((totalHardwareCost * (1 - residualValue / 100)) / (depreciationYears * 12)).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="cost-display" style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
              border: '1px solid #e2e8f0'
            }}>
              <h4>Detected Hardware</h4>
              <table style={{ width: '100%', marginTop: '1rem' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0', color: '#718096', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0' }}>
                      Host
                    </th>
                    <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#718096', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0' }}>
                      Cores
                    </th>
                    <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#718096', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0' }}>
                      Memory
                    </th>
                    <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#718096', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0' }}>
                      Price
                    </th>
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
                      <td style={{ textAlign: 'right', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
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

      {/* Step 2: Operating Expenses */}
      {currentStep === 2 && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="cost-display" style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: '#2d3748' }}>
                <Building size={20} style={{ marginRight: '0.5rem', color: '#667eea' }} />
                Operating Expense Builder
              </h4>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#4a5568',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Power & Cooling (Monthly)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#718096' }}>$</span>
                  <input
                    type="number"
                    value={powerCooling}
                    onChange={(e) => setPowerCooling(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'all 0.3s'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#4a5568',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Facilities/Rack Space (Monthly)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#718096' }}>$</span>
                  <input
                    type="number"
                    value={facilities}
                    onChange={(e) => setFacilities(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'all 0.3s'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#4a5568',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Network/Bandwidth (Monthly)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#718096' }}>$</span>
                  <input
                    type="number"
                    value={networkBandwidth}
                    onChange={(e) => setNetworkBandwidth(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'all 0.3s'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#4a5568',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Staff Allocation (Monthly)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#718096' }}>$</span>
                  <input
                    type="number"
                    value={staffAllocation}
                    onChange={(e) => setStaffAllocation(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'all 0.3s'
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.5rem' }}>
                  Percentage of FTE costs allocated to infrastructure
                </p>
              </div>
            </div>

            <div className="cost-display" style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
              border: '1px solid #e2e8f0'
            }}>
              <h4>Distribution Method</h4>
              <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '1.5rem' }}>
                How should operating expenses be distributed across VMs?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { value: 'cpu', label: 'By CPU Usage', description: 'Proportional to CPU cores' },
                  { value: 'memory', label: 'By Memory', description: 'Proportional to RAM allocation' },
                  { value: 'equal', label: 'Equal Split', description: 'Same cost per VM' },
                  { value: 'custom', label: 'Custom Formula', description: 'Define your own logic' }
                ].map(method => (
                  <label key={method.value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '1rem',
                    border: distributionMethod === method.value ? '2px solid #667eea' : '2px solid #e2e8f0',
                    borderRadius: '8px',
                    background: distributionMethod === method.value ? 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)' : 'white',
                    transition: 'all 0.3s'
                  }}>
                    <input
                      type="radio"
                      name="distribution"
                      value={method.value}
                      checked={distributionMethod === method.value}
                      onChange={() => setDistributionMethod(method.value)}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <div>
                      <div style={{ fontWeight: distributionMethod === method.value ? '600' : '400' }}>
                        {method.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                        {method.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
                borderRadius: '10px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>Total Monthly OpEx</div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginTop: '0.5rem'
                }}>
                  ${(powerCooling + facilities + networkBandwidth + staffAllocation).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
                  Per VM: ${Math.round((powerCooling + facilities + networkBandwidth + staffAllocation) / vms.length).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Software Licensing */}
      {currentStep === 3 && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="cost-display" style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: '#2d3748' }}>
                <Code size={20} style={{ marginRight: '0.5rem', color: '#667eea' }} />
                Software License Templates
              </h4>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#4a5568',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  VMware vSphere (Annual)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#718096' }}>$</span>
                  <input
                    type="number"
                    value={vmwareLicense}
                    onChange={(e) => setVmwareLicense(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'all 0.3s'
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.5rem' }}>
                  Per CPU socket licensing
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#4a5568',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Windows Server (Per VM/Month)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#718096' }}>$</span>
                  <input
                    type="number"
                    value={windowsLicense}
                    onChange={(e) => setWindowsLicense(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'all 0.3s'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#4a5568',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  SQL Server Enterprise (Per Core/Month)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#718096' }}>$</span>
                  <input
                    type="number"
                    value={sqlLicense}
                    onChange={(e) => setSqlLicense(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'all 0.3s'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#4a5568',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Oracle Database (Optional)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#718096' }}>$</span>
                  <input
                    type="number"
                    value={oracleLicense}
                    onChange={(e) => setOracleLicense(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'all 0.3s'
                    }}
                  />
                </div>
              </div>

              <Button
                kind="tertiary"
                size="sm"
                style={{
                  marginTop: '1rem',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px'
                }}
              >
                + Add Custom Software
              </Button>
            </div>

            <div className="cost-display" style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
              border: '1px solid #e2e8f0'
            }}>
              <h4>License Summary</h4>
              
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#718096' }}>VMware vSphere</span>
                  <span style={{ fontWeight: '600' }}>${(vmwareLicense / 12).toFixed(0)}/mo</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#718096' }}>Windows Server ({vms.filter(v => v.name.includes('WIN')).length} VMs)</span>
                  <span style={{ fontWeight: '600' }}>${windowsLicense * vms.filter(v => v.name.includes('WIN')).length}/mo</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#718096' }}>SQL Server ({vms.filter(v => v.name.includes('DB')).length} instances)</span>
                  <span style={{ fontWeight: '600' }}>${sqlLicense * vms.filter(v => v.name.includes('DB')).length}/mo</span>
                </div>
                {oracleLicense > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#718096' }}>Oracle Database</span>
                    <span style={{ fontWeight: '600' }}>${oracleLicense}/mo</span>
                  </div>
                )}
              </div>

              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
                borderRadius: '10px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>Total Software Licensing</div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginTop: '0.5rem'
                }}>
                  ${((vmwareLicense / 12) + (windowsLicense * vms.filter(v => v.name.includes('WIN')).length) + (sqlLicense * vms.filter(v => v.name.includes('DB')).length) + oracleLicense).toLocaleString()}/mo
                </div>
              </div>

              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: '#fff3cd',
                borderLeft: '4px solid #ffc107',
                borderRadius: '4px'
              }}>
                <p style={{ fontSize: '0.875rem', color: '#856404' }}>
                  <Information size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  License costs are distributed across VMs based on actual usage patterns
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Review & Validate */}
      {currentStep === 4 && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '2rem', color: '#2d3748' }}>Configuration Summary</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Calculator size={20} style={{ marginRight: '0.5rem', color: '#667eea' }} />
                <h4 style={{ margin: 0 }}>Hardware</h4>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d3748' }}>
                ${((totalHardwareCost * (1 - residualValue / 100)) / (depreciationYears * 12)).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#718096' }}>per month</div>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Building size={20} style={{ marginRight: '0.5rem', color: '#667eea' }} />
                <h4 style={{ margin: 0 }}>Operations</h4>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d3748' }}>
                ${(powerCooling + facilities + networkBandwidth + staffAllocation).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#718096' }}>per month</div>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Code size={20} style={{ marginRight: '0.5rem', color: '#667eea' }} />
                <h4 style={{ margin: 0 }}>Software</h4>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d3748' }}>
                ${((vmwareLicense / 12) + (windowsLicense * vms.filter(v => v.name.includes('WIN')).length) + (sqlLicense * vms.filter(v => v.name.includes('DB')).length) + oracleLicense).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#718096' }}>per month</div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '2rem',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
          }}>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>Total Monthly Infrastructure Cost</h3>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              ${costs.totalMonthly.toLocaleString()}
            </div>
            <div style={{ fontSize: '1.125rem', opacity: 0.95 }}>
              Across {vms.length} virtual machines
            </div>
            <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', opacity: 0.9 }}>
              Average cost per VM: ${Math.round(costs.totalMonthly / vms.length).toLocaleString()}/month
            </div>
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: '#f0f9ff',
            borderLeft: '4px solid #0284c7',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: '#0c4a6e', marginBottom: '0.5rem' }}>
              <CheckmarkFilled size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle', color: '#0284c7' }} />
              Configuration Validated
            </h4>
            <p style={{ color: '#075985', margin: 0 }}>
              Your cost model has been validated and is ready to apply. These rates will be used to calculate costs for all VMs in your infrastructure.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
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