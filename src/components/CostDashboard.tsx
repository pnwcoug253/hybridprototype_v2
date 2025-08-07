// @ts-nocheck

import React, { useState } from 'react';
import { Button, Tag, Toggle } from '@carbon/react';
import { Reset, Download, ChartBar } from '@carbon/icons-react';
import { VM } from '../data/vmwareData';
import { CostProfile, calculateTotalCosts, calculateVMCost, identifyOptimizationOpportunities } from '../utils/costCalculations';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CostDashboardProps {
  vms: VM[];
  costProfile: CostProfile;
  onReset: () => void;
}

const COLORS = ['#0f62fe', '#42be65', '#fa4d56', '#ff8389', '#ba4e00', '#8a3800'];

const CostDashboard: React.FC<CostDashboardProps> = ({ vms, costProfile, onReset }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('monthly');
  const [groupBy, setGroupBy] = useState<'department' | 'environment' | 'application'>('department');
  
  const costs = calculateTotalCosts(vms, costProfile);
  const opportunities = identifyOptimizationOpportunities(vms);
  
  const displayCosts = viewMode === 'daily' ? costs.totalDaily : costs.totalMonthly;
  
  // Prepare chart data
  const chartData = Object.entries(
    groupBy === 'department' ? costs.byDepartment :
    groupBy === 'environment' ? costs.byEnvironment :
    costs.byApplication
  ).map(([name, value]) => ({
    name,
    value: viewMode === 'daily' ? value / 30 : value
  })).sort((a, b) => b.value - a.value);
  
  const pieData = chartData.slice(0, 5);
  
  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Cost Management Dashboard</h1>
          <p style={{ color: '#525252' }}>
            Real-time visibility into your hybrid infrastructure costs
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button kind="secondary" size="sm" renderIcon={Download}>
            Export Report
          </Button>
          <Button kind="ghost" size="sm" renderIcon={Reset} onClick={onReset}>
            Start Over
          </Button>
        </div>
      </div>
      
      {/* Cost Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div className="cost-display">
          <div className="metric-label">Total Infrastructure Cost</div>
          <div className="metric-value">
            ${displayCosts.toLocaleString()}
          </div>
          <div className="metric-change">
            {viewMode === 'daily' ? 'Per Day' : 'Per Month'}
          </div>
          <Toggle
            size="sm"
            id="view-toggle"
            labelA="Daily"
            labelB="Monthly"
            toggled={viewMode === 'monthly'}
            onToggle={(checked) => setViewMode(checked ? 'monthly' : 'daily')}
            style={{ marginTop: '1rem' }}
          />
        </div>
        
        <div className="cost-display">
          <div className="metric-label">Active VMs</div>
          <div className="metric-value">
            {vms.filter(vm => vm.powerState === 'poweredOn').length}
          </div>
          <div className="metric-change negative">
            {vms.filter(vm => vm.powerState === 'poweredOff').length} powered off
          </div>
        </div>
        
        <div className="cost-display">
          <div className="metric-label">Optimization Potential</div>
          <div className="metric-value">
            ${opportunities.totalSavingsOpportunity.toLocaleString()}
          </div>
          <div className="metric-change">
            {Math.round((opportunities.totalSavingsOpportunity / costs.totalMonthly) * 100)}% of total
          </div>
        </div>
        
        <div className="cost-display">
          <div className="metric-label">Unallocated Costs</div>
          <div className="metric-value">
            ${(costs.byDepartment['Unallocated'] || 0).toFixed(0)}
          </div>
          <div className="metric-change negative">
            {opportunities.missingTags.length} VMs missing tags
          </div>
        </div>
      </div>
      
      {/* Group By Selector */}
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ marginRight: '1rem' }}>Group costs by:</span>
        <Button 
          kind={groupBy === 'department' ? 'primary' : 'tertiary'} 
          size="sm"
          onClick={() => setGroupBy('department')}
        >
          Department
        </Button>
        <Button 
          kind={groupBy === 'environment' ? 'primary' : 'tertiary'} 
          size="sm"
          onClick={() => setGroupBy('environment')}
          style={{ marginLeft: '0.5rem' }}
        >
          Environment
        </Button>
        <Button 
          kind={groupBy === 'application' ? 'primary' : 'tertiary'} 
          size="sm"
          onClick={() => setGroupBy('application')}
          style={{ marginLeft: '0.5rem' }}
        >
          Application
        </Button>
      </div>
      
      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="cost-display">
          <h4>
            <ChartBar size={20} style={{ marginRight: '0.5rem' }} />
            Cost Breakdown
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(0)}`} />
              <Bar dataKey="value" fill="#0f62fe" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="cost-display">
          <h4>Top 5 Cost Centers</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(0)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* VM Details Table */}
      <div className="vm-table">
        <h4 style={{ padding: '1rem' }}>Virtual Machine Details</h4>
        <table>
          <thead>
            <tr>
              <th>VM Name</th>
              <th>Environment</th>
              <th>Department</th>
              <th>Resources</th>
              <th>Utilization</th>
              <th>Monthly Cost</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vms.slice(0, 10).map(vm => {
              const cost = calculateVMCost(vm, costProfile);
              return (
                <tr key={vm.id}>
                  <td>{vm.name}</td>
                  <td>
                    <Tag 
                      type={
                        vm.tags.environment === 'Production' ? 'red' :
                        vm.tags.environment === 'Development' ? 'blue' :
                        vm.tags.environment === 'Test' ? 'purple' :
                        'gray'
                      }
                      size="sm"
                    >
                      {vm.tags.environment || 'Untagged'}
                    </Tag>
                  </td>
                  <td>{vm.tags.department || 'Unallocated'}</td>
                  <td>{vm.vCPU} vCPU / {vm.memoryGB}GB / {vm.storageGB}GB</td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>
                      CPU: {vm.cpuUsageAvg}%<br />
                      Mem: {vm.memoryUsageAvg}%
                    </div>
                  </td>
                  <td style={{ fontWeight: 'bold' }}>${cost.toFixed(0)}</td>
                  <td>
                    {vm.powerState === 'poweredOn' ? (
                      <Tag type="green" size="sm">Active</Tag>
                    ) : (
                      <Tag type="gray" size="sm">Powered Off</Tag>
                    )}
                    {vm.cpuUsageAvg < 10 && vm.powerState === 'poweredOn' && (
                      <Tag type="red" size="sm" style={{ marginLeft: '0.25rem' }}>Zombie</Tag>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid #e0e0e0' }}>
          <Button kind="tertiary" size="sm">
            View All {vms.length} VMs
          </Button>
        </div>
      </div>
      
      {/* Optimization CTA */}
      <div className="optimize-cta">
        <h3>💡 Optimization Opportunities Detected</h3>
        <p>
          We found ${opportunities.totalSavingsOpportunity.toLocaleString()}/month in potential savings:
        </p>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0, 
          margin: '1rem 0',
          display: 'inline-block',
          textAlign: 'left'
        }}>
          <li>• {opportunities.oversized.length} oversized VMs can be rightsized</li>
          <li>• {opportunities.zombies.length} zombie VMs can be decommissioned</li>
          <li>• {opportunities.poweredOff.length} powered-off VMs still consuming resources</li>
        </ul>
        <button>
  Optimize with Turbonomic Premium
</button>
      </div>
    </div>
  );
};

export default CostDashboard;