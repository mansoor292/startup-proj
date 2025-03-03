import React, { useState, useEffect } from 'react';
import RevenueChart from './RevenueChart';
import ProfitChart from './ProfitChart';
import ClientChart from './ClientChart';
import { 
  Tooltip,
} from 'recharts';

interface MonthlyData {
  month: number;
  label: string;
  clients: number;
  revenue: number;
  profit: number;
  marketingBudget: number;
  netProfit: number;
  newClients: number;
  churnedClients: number;
  cumulativeRevenue: number;
  cumulativeProfit: number;
  seedBudgetRemaining: number;
  customerLTV: number;
  ltvToCacRatio: number;
}

interface ModernChartsProps {
  projectionData: MonthlyData[];
  periodType: string;
  colors: any;
}

const ModernCharts: React.FC<ModernChartsProps> = ({ projectionData, periodType, colors }) => {
  const [activeData, setActiveData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('revenue');

  useEffect(() => {
    // Set the data based on period type
    if (periodType === 'monthly') {
      setActiveData(projectionData);
    } else if (periodType === 'quarterly') {
      // TODO: Implement quarterly data
      setActiveData(projectionData);
    } else {
      // TODO: Implement yearly data
      setActiveData(projectionData);
    }
  }, [periodType, projectionData, setActiveData]);

  const tabs = [
    { id: 'revenue', label: 'Revenue' },
    { id: 'profit', label: 'Profit & Marketing' },
    { id: 'clients', label: 'Client Growth' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.label}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            {payload.map((entry: any) => (
              <div key={entry.name} className="flex items-center">
                <div
                  className="w-3 h-3 mr-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}:</span>
                <span className="ml-1 font-semibold text-sm">
                  {entry.name === 'Clients' ? entry.value.toLocaleString() : `$${entry.value.toLocaleString()}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header with tabs */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-bold text-gray-800">Financial Projections</h2>
          <p className="text-gray-500">5-year growth forecast based on current metrics</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Chart type tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeTab === tab.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      {activeTab === 'revenue' && (
        <div className="h-80">
          <RevenueChart data={activeData} periodType={periodType} colors={colors} CustomTooltip={CustomTooltip} />
        </div>
      )}

      {/* Profit & Marketing Chart */}
      {activeTab === 'profit' && (
        <div className="h-80">
          <ProfitChart data={activeData} periodType={periodType} colors={colors} CustomTooltip={CustomTooltip} />
        </div>
      )}

      {/* Client Growth Chart */}
      {activeTab === 'clients' && (
        <div className="h-80">
          <ClientChart data={activeData} periodType={periodType} colors={colors} CustomTooltip={CustomTooltip} />
        </div>
      )}
    </div>
  );
};

export default ModernCharts;
