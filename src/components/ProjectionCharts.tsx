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
  const [activePeriod, setActivePeriod] = useState<string>(periodType);

  useEffect(() => {
    // Set the data based on period type
    if (activePeriod === 'monthly') {
      setActiveData(projectionData);
    } else if (activePeriod === 'quarterly') {
      // Group data by quarters
      const quarterlyData = [];
      for (let i = 0; i < projectionData.length; i += 3) {
        if (i + 2 < projectionData.length) {
          const quarterData = {
            ...projectionData[i + 2],
            label: `Q${Math.floor(i / 3) + 1} Y${Math.floor(i / 12) + 1}`,
            revenue: projectionData.slice(i, i + 3).reduce((sum, month) => sum + month.revenue, 0),
            profit: projectionData.slice(i, i + 3).reduce((sum, month) => sum + month.profit, 0),
            marketingBudget: projectionData.slice(i, i + 3).reduce((sum, month) => sum + month.marketingBudget, 0),
            netProfit: projectionData.slice(i, i + 3).reduce((sum, month) => sum + month.netProfit, 0),
            // Use the last month's client count for the quarter
            clients: projectionData[i + 2].clients,
            // Include other metrics that might be needed
            newClients: projectionData.slice(i, i + 3).reduce((sum, month) => sum + month.newClients, 0),
            churnedClients: projectionData.slice(i, i + 3).reduce((sum, month) => sum + month.churnedClients, 0),
          };
          quarterlyData.push(quarterData);
        }
      }
      setActiveData(quarterlyData);
    } else {
      // Group data by years
      const yearlyData = [];
      for (let i = 0; i < projectionData.length; i += 12) {
        if (i + 11 < projectionData.length) {
          const yearData = {
            ...projectionData[i + 11],
            label: `Year ${Math.floor(i / 12) + 1}`,
            revenue: projectionData.slice(i, i + 12).reduce((sum, month) => sum + month.revenue, 0),
            profit: projectionData.slice(i, i + 12).reduce((sum, month) => sum + month.profit, 0),
            marketingBudget: projectionData.slice(i, i + 12).reduce((sum, month) => sum + month.marketingBudget, 0),
            netProfit: projectionData.slice(i, i + 12).reduce((sum, month) => sum + month.netProfit, 0),
            // Use the last month's client count for the year
            clients: projectionData[i + 11].clients,
            // Include other metrics that might be needed
            newClients: projectionData.slice(i, i + 12).reduce((sum, month) => sum + month.newClients, 0),
            churnedClients: projectionData.slice(i, i + 12).reduce((sum, month) => sum + month.churnedClients, 0),
          };
          yearlyData.push(yearData);
        }
      }
      setActiveData(yearlyData);
    }
  }, [activePeriod, projectionData]);

  const periodOptions = [
    { id: 'monthly', label: 'Monthly' },
    { id: 'quarterly', label: 'Quarterly' },
    { id: 'annual', label: 'Annual' },
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
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8 border border-slate-100">
      {/* Header with period selector */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Financial Projections</h2>
          <p className="text-slate-500">5-year growth forecast based on current metrics</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Period type selector */}
          <div className="flex bg-slate-100 rounded-full p-1 shadow-sm">
            {periodOptions.map((option) => (
              <button
                key={option.id}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activePeriod === option.id 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
                onClick={() => setActivePeriod(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* All charts in stacked layout */}
      <div className="flex flex-col gap-6">
        {/* Revenue Chart */}
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-4 sm:p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-1 h-8 bg-blue-500 rounded-full mr-3"></div>
            <h3 className="text-xl font-semibold text-slate-800">Revenue</h3>
          </div>
          <div className="h-64 sm:h-80">
            <RevenueChart data={activeData} periodType={activePeriod} colors={colors} CustomTooltip={CustomTooltip} />
          </div>
        </div>

        {/* Profit & Marketing Chart */}
        <div className="bg-gradient-to-br from-green-50 to-slate-50 p-4 sm:p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-1 h-8 bg-green-500 rounded-full mr-3"></div>
            <h3 className="text-xl font-semibold text-slate-800">Profit & Marketing</h3>
          </div>
          <div className="h-64 sm:h-80">
            <ProfitChart data={activeData} periodType={activePeriod} colors={colors} CustomTooltip={CustomTooltip} />
          </div>
        </div>

        {/* Client Growth Chart */}
        <div className="bg-gradient-to-br from-amber-50 to-slate-50 p-4 sm:p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-1 h-8 bg-amber-500 rounded-full mr-3"></div>
            <h3 className="text-xl font-semibold text-slate-800">Client Growth</h3>
          </div>
          <div className="h-64 sm:h-80">
            <ClientChart data={activeData} periodType={activePeriod} colors={colors} CustomTooltip={CustomTooltip} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernCharts;
