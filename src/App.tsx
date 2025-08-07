// src/App.tsx - Updated
// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@carbon/react';
import { ArrowRight, Warning } from '@carbon/icons-react';
import { vmwareVMs, vmwareHosts, vmwareDatastores } from './data/vmwareData';
import {
  defaultCostProfile,
  calculateTotalCosts,
  identifyOptimizationOpportunities,
  CostProfile
} from './utils/costCalculations';
import QuickStart from './components/QuickStart';
import GuidedSetup from './components/GuidedSetup';
import AdvancedMode from './components/AdvancedMode';
import CostDashboard from './components/CostDashboard';
import HybridCostFlow from './components/HybridCostFlow';

type PathType = 'none' | 'quick' | 'guided' | 'advanced' | 'demo';

function App() {
  const [selectedPath, setSelectedPath] = useState<PathType>('none');
  const [costProfile, setCostProfile] = useState<CostProfile>(defaultCostProfile);
  const [isComplete, setIsComplete] = useState(false);

  const opportunities = identifyOptimizationOpportunities(vmwareVMs);
  const costs = calculateTotalCosts(vmwareVMs, costProfile);

  const handlePathComplete = (profile: CostProfile) => {
    setCostProfile(profile);
    setIsComplete(true);
  };

  const resetDemo = () => {
    setSelectedPath('none');
    setIsComplete(false);
    setCostProfile(defaultCostProfile);
  };

  // Show the complete flow demo
  if (selectedPath === 'demo') {
    return <HybridCostFlow />;
  }

  if (isComplete) {
    return (
      <div className="app-container">
        <CostDashboard
          vms={vmwareVMs}
          costProfile={costProfile}
          onReset={resetDemo}
        />
      </div>
    );
  }

  if (selectedPath === 'quick') {
    return (
      <div className="app-container">
        <QuickStart
          vms={vmwareVMs}
          onComplete={handlePathComplete}
          onBack={() => setSelectedPath('none')}
        />
      </div>
    );
  }

  if (selectedPath === 'guided') {
    return (
      <div className="app-container">
        <GuidedSetup
          vms={vmwareVMs}
          hosts={vmwareHosts}
          onComplete={handlePathComplete}
          onBack={() => setSelectedPath('none')}
        />
      </div>
    );
  }

  if (selectedPath === 'advanced') {
    return (
      <div className="app-container">
        <AdvancedMode
          vms={vmwareVMs}
          hosts={vmwareHosts}
          datastores={vmwareDatastores}
          onComplete={handlePathComplete}
          onBack={() => setSelectedPath('none')}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="main-content">
        <h1 style={{ marginBottom: '0.5rem' }}>Cloudability Hybrid Cost Management</h1>
        <p style={{ color: '#525252', marginBottom: '2rem' }}>
          Connected to vCenter: {vmwareVMs.length} VMs detected across {vmwareHosts.length} hosts
        </p>

        {/* Add Demo Button */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
        }}>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>See the Integrated Solution</h2>
          <p style={{ marginBottom: '1.5rem', opacity: 0.95 }}>
            Go from zero to one by stitching on-prem cost profiles with your on-prem and private cloud resource inventory.
          </p>
          <Button
            size="lg"
            onClick={() => setSelectedPath('demo')}
            style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              padding: '1rem 3rem',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Stitch Costs Now
          </Button>
        </div>

        {opportunities.missingTags.length > 0 && (
          <div className="warning-banner">
            <h5>
              <Warning size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Data Quality Issues Detected
            </h5>
            <ul>
              <li>{opportunities.missingTags.length} VMs have missing tags - costs will go to 'Unallocated'</li>
              <li>{opportunities.zombies.length} VMs appear to be unused (zombie VMs)</li>
              <li>{opportunities.poweredOff.length} VMs are powered off but still consuming storage</li>
            </ul>
          </div>
        )}

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Or Choose Your Setup Path</h2>
        
        <div className="path-selector">
          <div className="path-card" onClick={() => setSelectedPath('quick')}>
            <h3>Quick Start</h3>
            <div className="time-estimate">⏱ 5 minutes</div>
            <div className="description">
              Get immediate cost visibility with intelligent defaults based on industry benchmarks.
            </div>
            <ul className="features">
              <li>Auto-detected resource costs</li>
              <li>Industry-standard rates</li>
              <li>Single adjustment slider</li>
              <li>Instant dashboard access</li>
            </ul>
            <Button
              renderIcon={ArrowRight}
              size="md"
              style={{ marginTop: '1rem', width: '100%' }}
            >
              Start Quick Setup
            </Button>
          </div>

          <div className="path-card" onClick={() => setSelectedPath('guided')}>
            <h3>Guided Setup</h3>
            <div className="time-estimate">⏱ 15 minutes</div>
            <div className="description">
              Step-by-step configuration with customized cost models for your environment.
            </div>
            <ul className="features">
              <li>Hardware depreciation calculator</li>
              <li>Operating expense builder</li>
              <li>Software license templates</li>
              <li>Validation and recommendations</li>
            </ul>
            <Button
              renderIcon={ArrowRight}
              size="md"
              kind="secondary"
              style={{ marginTop: '1rem', width: '100%' }}
            >
              Start Guided Setup
            </Button>
          </div>

          <div className="path-card" onClick={() => setSelectedPath('advanced')}>
            <h3>Advanced Mode</h3>
            <div className="time-estimate">⏱ 30+ minutes</div>
            <div className="description">
              Full control over cost modeling with formula builders and multi-source integration.
            </div>
            <ul className="features">
              <li>Custom formula builder</li>
              <li>Department-specific rates</li>
              <li>Complex allocation rules</li>
              <li>Version control</li>
            </ul>
            <Button
              renderIcon={ArrowRight}
              size="md"
              kind="tertiary"
              style={{ marginTop: '1rem', width: '100%' }}
            >
              Start Advanced Setup
            </Button>
          </div>
        </div>

        <div className="cost-display">
          <h4>Preview with Default Rates</h4>
          <div className="cost-metrics">
            <div className="metric">
              <div className="metric-label">Monthly Cost (Estimated)</div>
              <div className="metric-value">${costs.totalMonthly.toLocaleString()}</div>
              <div className="metric-change">Based on industry defaults</div>
            </div>
            <div className="metric">
              <div className="metric-label">Potential Savings</div>
              <div className="metric-value">${opportunities.totalSavingsOpportunity.toLocaleString()}</div>
              <div className="metric-change">Through optimization</div>
            </div>
            <div className="metric">
              <div className="metric-label">Unallocated Costs</div>
              <div className="metric-value">
                {Math.round((opportunities.missingTags.length / vmwareVMs.length) * 100)}%
              </div>
              <div className="metric-change negative">Missing tags</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;