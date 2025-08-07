// src/components/HybridCostFlow.tsx
// @ts-nocheck
import React, { useState } from 'react';
import { Button, Tag, ProgressIndicator, InlineNotification } from '@carbon/react';
import { 
  Connect, 
  DataTable, 
  Currency, 
  ChartLine, 
  Checkmark,
  ArrowRight,
  Api,
  Document,
  Chemistry,
  View
} from '@carbon/icons-react';

const HybridCostFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [resourcesConnected, setResourcesConnected] = useState(false);
  const [costProfileBuilt, setCostProfileBuilt] = useState(false);
  const [dataEnriched, setDataEnriched] = useState(false);
  const [focusGenerated, setFocusGenerated] = useState(false);

  const steps = [
    {
      id: 'connect',
      title: 'Connect Infrastructure',
      description: 'Connect to vCenter, Nutanix, or upload CSV',
      icon: Connect,
      status: resourcesConnected ? 'complete' : 'current'
    },
    {
      id: 'profile',
      title: 'Build Cost Profile',
      description: 'Configure hardware, OpEx, and licensing costs',
      icon: Currency,
      status: costProfileBuilt ? 'complete' : resourcesConnected ? 'current' : 'incomplete'
    },
    {
      id: 'enrich',
      title: 'Enrich & Map',
      description: 'Apply costs to resources and map to FOCUS',
      icon: Chemistry,
      status: dataEnriched ? 'complete' : costProfileBuilt ? 'current' : 'incomplete'
    },
    {
      id: 'analyze',
      title: 'Analyze & Optimize',
      description: 'View costs and optimization opportunities',
      icon: ChartLine,
      status: focusGenerated ? 'complete' : dataEnriched ? 'current' : 'incomplete'
    }
  ];

  const renderStepIndicator = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      marginBottom: '3rem',
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
    }}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentStep;
        const isComplete = index < currentStep;
        
        return (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div 
              onClick={() => index <= currentStep && setCurrentStep(index)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: index <= currentStep ? 'pointer' : 'default',
                opacity: index > currentStep ? 0.4 : 1,
                transition: 'all 0.3s'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: isActive 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : isComplete 
                    ? '#48bb78'
                    : '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.5rem',
                boxShadow: isActive ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none',
                transition: 'all 0.3s'
              }}>
                {isComplete ? (
                  <Checkmark size={24} style={{ color: 'white' }} />
                ) : (
                  <Icon size={24} style={{ color: isActive ? 'white' : '#718096' }} />
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{step.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#718096', maxWidth: '120px' }}>
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div style={{
                width: '100px',
                height: '2px',
                background: index < currentStep ? '#48bb78' : '#e2e8f0',
                margin: '0 1rem',
                marginBottom: '3rem',
                transition: 'all 0.3s'
              }} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStep0 = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Connect Your Infrastructure</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div 
            onClick={() => setResourcesConnected(true)}
            style={{
              padding: '1.5rem',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              ':hover': { borderColor: '#667eea' }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <Api size={20} style={{ marginRight: '0.75rem', color: '#667eea' }} />
              <strong>vCenter API</strong>
              <Tag type="green" size="sm" style={{ marginLeft: 'auto' }}>Recommended</Tag>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#718096' }}>
              Direct connection to VMware vSphere
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            opacity: 0.7
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <Document size={20} style={{ marginRight: '0.75rem', color: '#667eea' }} />
              <strong>CSV Upload</strong>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#718096' }}>
              Upload infrastructure inventory CSV
            </p>
          </div>
        </div>

        {resourcesConnected && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#f0f9ff',
            borderLeft: '4px solid #0284c7',
            borderRadius: '8px'
          }}>
            <strong>✓ Connected Successfully</strong>
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Discovered: 25 VMs, 5 Hosts, 3 Datastores
            </div>
          </div>
        )}
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Discovered Resources</h3>
        
        {!resourcesConnected ? (
          <div style={{ 
            height: '200px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#718096'
          }}>
            Connect to infrastructure to see resources
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                flex: 1,
                padding: '1rem',
                background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>25</div>
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>Virtual Machines</div>
              </div>
              <div style={{
                flex: 1,
                padding: '1rem',
                background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>5</div>
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>ESXi Hosts</div>
              </div>
            </div>

            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Resource</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>vCPU</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>RAM</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem' }}>PROD-WEB-001</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>4</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>16GB</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem' }}>PROD-DB-001</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>8</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>32GB</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
    }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Configure Cost Profile</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
        <div style={{
          padding: '1.5rem',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)'
        }}>
          <h4 style={{ marginBottom: '1rem' }}>Hardware Costs</h4>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.875rem', color: '#718096' }}>Total Investment</label>
            <input 
              type="text" 
              value="$125,000" 
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                border: '1px solid #e2e8f0',
                borderRadius: '4px'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.875rem', color: '#718096' }}>Depreciation</label>
            <select style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
              border: '1px solid #e2e8f0',
              borderRadius: '4px'
            }}>
              <option>5 years</option>
              <option>3 years</option>
              <option>7 years</option>
            </select>
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)'
        }}>
          <h4 style={{ marginBottom: '1rem' }}>Operating Expenses</h4>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.875rem', color: '#718096' }}>Power & Cooling</label>
            <input 
              type="text" 
              value="$5,000/mo" 
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                border: '1px solid #e2e8f0',
                borderRadius: '4px'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.875rem', color: '#718096' }}>Facilities</label>
            <input 
              type="text" 
              value="$3,000/mo" 
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                border: '1px solid #e2e8f0',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)'
        }}>
          <h4 style={{ marginBottom: '1rem' }}>Software Licensing</h4>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.875rem', color: '#718096' }}>VMware vSphere</label>
            <input 
              type="text" 
              value="$3,000/yr" 
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                border: '1px solid #e2e8f0',
                borderRadius: '4px'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.875rem', color: '#718096' }}>Windows Server</label>
            <input 
              type="text" 
              value="$100/VM/mo" 
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                border: '1px solid #e2e8f0',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
      </div>

      <Button
        onClick={() => setCostProfileBuilt(true)}
        style={{
          marginTop: '1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          padding: '0.75rem 2rem',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Calculate & Apply Costs
      </Button>

      {costProfileBuilt && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f0f9ff',
          borderLeft: '4px solid #0284c7',
          borderRadius: '8px'
        }}>
          <strong>✓ Cost Profile Configured</strong>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Total monthly cost: $42,083 across all infrastructure
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
    }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Data Enrichment Pipeline</h2>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2rem',
        background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
        borderRadius: '10px',
        marginBottom: '2rem'
      }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1rem',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <DataTable size={32} style={{ color: '#667eea' }} />
          </div>
          <div style={{ fontWeight: '600' }}>Resource Data</div>
          <div style={{ fontSize: '0.875rem', color: '#718096' }}>25 VMs from vCenter</div>
        </div>
        
        <ArrowRight size={24} style={{ color: '#667eea', margin: '0 1rem' }} />
        
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1rem',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <Currency size={32} style={{ color: '#667eea' }} />
          </div>
          <div style={{ fontWeight: '600' }}>Apply Costs</div>
          <div style={{ fontSize: '0.875rem', color: '#718096' }}>$42,083/month</div>
        </div>
        
        <ArrowRight size={24} style={{ color: '#667eea', margin: '0 1rem' }} />
        
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1rem',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <Document size={32} style={{ color: '#667eea' }} />
          </div>
          <div style={{ fontWeight: '600' }}>FOCUS Format</div>
          <div style={{ fontSize: '0.875rem', color: '#718096' }}>v1.2 Compliant</div>
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Enrichment Method</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div 
          onClick={() => setDataEnriched(true)}
          style={{
            padding: '1rem',
            border: '2px solid #667eea',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
            cursor: 'pointer'
          }}
        >
          <strong>Direct Formula Application</strong>
          <p style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
            Apply cost formulas during FOCUS transformation
          </p>
        </div>
        <div style={{
          padding: '1rem',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          opacity: 0.7
        }}>
          <strong>Lookup Table Join</strong>
          <p style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
            Join costs via resource ID mapping
          </p>
        </div>
      </div>

      {dataEnriched && (
        <>
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            background: '#f0f9ff',
            borderLeft: '4px solid #0284c7',
            borderRadius: '8px'
          }}>
            <strong>✓ Data Successfully Enriched</strong>
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              All 25 resources now have cost data attached
            </div>
          </div>

          <h3 style={{ marginBottom: '1rem' }}>Preview Enriched FOCUS Data</h3>
          <div style={{
            background: '#1a202c',
            color: '#10b981',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            overflow: 'auto'
          }}>
            <pre>{`{
  "ResourceId": "vm-001",
  "ResourceName": "PROD-WEB-001",
  "ResourceType": "Virtual Machine",
  "ServiceName": "VMware vSphere",
  "ServiceCategory": "Compute",
  "Region": "on-premises-dc1",
  "BilledCost": 1683.32,
  "BillingCurrency": "USD",
  "BillingPeriodStart": "2025-01-01T00:00:00Z",
  "BillingPeriodEnd": "2025-01-31T23:59:59Z",
  "ChargeCategory": "Usage",
  "ChargeClass": "Consumed",
  "ChargeType": "Usage",
  "x_vCPU": 4,
  "x_MemoryGB": 16,
  "x_StorageGB": 100,
  "x_Environment": "Production",
  "x_Department": "Marketing"
}`}</pre>
          </div>
        </>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
        }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Cost Analytics Dashboard</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              color: 'white'
            }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Monthly Cost</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>$42,083</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>↑ 12% from last month</div>
            </div>
            
            <div style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              borderRadius: '8px',
              color: 'white'
            }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Cost per VM</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>$1,683</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Average across 25 VMs</div>
            </div>
            
            <div style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
              borderRadius: '8px',
              color: 'white'
            }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Optimization Potential</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>$8,417</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>20% savings identified</div>
            </div>
          </div>

          <h3 style={{ marginBottom: '1rem' }}>Cost Breakdown by Department</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100px', fontSize: '0.875rem' }}>Engineering</div>
              <div style={{ flex: 1, background: '#e2e8f0', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '45%', height: '100%', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }} />
              </div>
              <div style={{ width: '80px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600' }}>$18,937</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100px', fontSize: '0.875rem' }}>Marketing</div>
              <div style={{ flex: 1, background: '#e2e8f0', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', background: 'linear-gradient(90deg, #48bb78 0%, #38a169 100%)' }} />
              </div>
              <div style={{ width: '80px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600' }}>$10,521</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100px', fontSize: '0.875rem' }}>IT</div>
              <div style={{ flex: 1, background: '#e2e8f0', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '20%', height: '100%', background: 'linear-gradient(90deg, #4299e1 0%, #3182ce 100%)' }} />
              </div>
              <div style={{ width: '80px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600' }}>$8,417</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100px', fontSize: '0.875rem' }}>Unallocated</div>
              <div style={{ flex: 1, background: '#e2e8f0', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '10%', height: '100%', background: 'linear-gradient(90deg, #fc8181 0%, #f56565 100%)' }} />
              </div>
              <div style={{ width: '80px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600' }}>$4,208</div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
        }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Actions</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Button
              onClick={() => setFocusGenerated(true)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Export FOCUS Data
            </Button>
            
            <Button
              style={{
                background: 'white',
                color: '#667eea',
                border: '2px solid #667eea',
                padding: '0.75rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              View in Cloudability
            </Button>
            
            <Button
              style={{
                background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Optimize with Turbonomic
            </Button>
          </div>

          {focusGenerated && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#f0f9ff',
              borderLeft: '4px solid #0284c7',
              borderRadius: '8px'
            }}>
              <strong>✓ FOCUS Data Ready</strong>
              <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                focus_export_2025_01.csv (2.3 MB)
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{
        marginTop: '2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        padding: '2rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>🎉 Complete Hybrid Cost Visibility Achieved!</h3>
        <p style={{ opacity: 0.95, marginBottom: '1.5rem' }}>
          Your on-premises infrastructure now has the same cost transparency as your cloud resources.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>25</div>
            <div style={{ fontSize: '0.875rem' }}>Resources Costed</div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>100%</div>
            <div style={{ fontSize: '0.875rem' }}>FOCUS Compliant</div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>20%</div>
            <div style={{ fontSize: '0.875rem' }}>Savings Identified</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Cloudability Hybrid Infrastructure
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#718096' }}>
            Complete cost visibility for on-premises infrastructure
          </p>
        </div>

        {renderStepIndicator()}

        <div style={{ marginBottom: '2rem' }}>
          {currentStep === 0 && renderStep0()}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '2rem'
        }}>
          <Button
            onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
            style={{
              background: currentStep === 0 ? '#e2e8f0' : 'white',
              color: currentStep === 0 ? '#a0aec0' : '#667eea',
              border: currentStep === 0 ? 'none' : '2px solid #667eea',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </Button>

          <Button
            onClick={() => {
              if (currentStep === 0 && resourcesConnected) setCurrentStep(1);
              else if (currentStep === 1 && costProfileBuilt) setCurrentStep(2);
              else if (currentStep === 2 && dataEnriched) setCurrentStep(3);
            }}
            disabled={
              (currentStep === 0 && !resourcesConnected) ||
              (currentStep === 1 && !costProfileBuilt) ||
              (currentStep === 2 && !dataEnriched) ||
              currentStep === 3
            }
            style={{
              background: currentStep === 3 ? '#e2e8f0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              cursor: currentStep === 3 ? 'not-allowed' : 'pointer',
              opacity: (
                (currentStep === 0 && !resourcesConnected) ||
                (currentStep === 1 && !costProfileBuilt) ||
                (currentStep === 2 && !dataEnriched)
              ) ? 0.5 : 1
            }}
          >
            {currentStep === 3 ? 'Complete' : 'Next Step'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HybridCostFlow;