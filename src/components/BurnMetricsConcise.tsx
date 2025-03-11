import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import MonthlyData from '../types/MonthlyData';

interface BurnData extends MonthlyData {
  monthLabel?: string;
  cash?: number;
  runway?: number;
  monthlyBurn?: number;
  burnMultiple?: number;
  quarter?: string;
}

// Interface for quarterly data which only needs a subset of properties
interface QuarterlyBurnData {
  quarter: string;
  burnMultiple: number;
}

// Function to transform monthly data into quarterly averages for burn multiple
const calculateQuarterlyBurnData = (data: BurnData[]): QuarterlyBurnData[] => {
  if (!data || data.length === 0) return [];
  
  const quarterMap: { [key: string]: BurnData[] } = {};
  
  // Group by quarters based on month number
  data.forEach(month => {
    // Using label format Y1M1, Y1M2, etc.
    if (!month.label) return;
    
    // Extract year and month from label (format: Y1M1)
    const match = month.label.match(/Y(\d+)M(\d+)/);
    if (!match) return;
    
    const year = parseInt(match[1]);
    const monthNum = parseInt(match[2]);
    
    // Determine quarter
    let quarter = '';
    if (monthNum <= 3) quarter = `Q1 Y${year}`;
    else if (monthNum <= 6) quarter = `Q2 Y${year}`;
    else if (monthNum <= 9) quarter = `Q3 Y${year}`;
    else quarter = `Q4 Y${year}`;
    
    if (!quarterMap[quarter]) quarterMap[quarter] = [];
    quarterMap[quarter].push(month);
  });
  
  // Calculate averages for each quarter
  return Object.entries(quarterMap).map(([quarter, months]) => {
    // Calculate average burn multiple for the quarter
    const validBurnMultiples = months.filter(m => m.burnMultiple !== undefined && isFinite(m.burnMultiple));
    const avgBurnMultiple = validBurnMultiples.length > 0 
      ? validBurnMultiples.reduce((sum, m) => sum + (m.burnMultiple || 0), 0) / validBurnMultiples.length 
      : 0;
    
    return {
      quarter,
      burnMultiple: avgBurnMultiple
    };
  });
};

// Format currency values
const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  } else if (value < 0 && Math.abs(value) >= 1000000) {
    return `-$${(Math.abs(value) / 1000000).toFixed(1)}M`;
  } else if (value < 0 && Math.abs(value) >= 1000) {
    return `-$${(Math.abs(value) / 1000).toFixed(1)}K`;
  } else {
    return `$${value.toFixed(0)}`;
  }
};

// Format burn multiple
const formatBurnMultiple = (value: number): string => {
  if (!isFinite(value) || value > 100) return '∞';
  if (value === 0) return 'Profitable';
  return value.toFixed(1) + 'x';
};

// Define color for burn multiple
const getBurnMultipleColor = (value: number): string => {
  if (value <= 0) return '#10b981'; // Profitable (green)
  if (value <= 1) return '#22c55e'; // Very efficient (green)
  if (value <= 1.5) return '#a3e635'; // Good (light green)
  if (value <= 2) return '#facc15'; // Moderate (yellow)
  if (value <= 3) return '#fb923c'; // Concerning (orange)
  return '#ef4444'; // Poor (red)
};

interface BurnMetricsConciseProps {
  data: BurnData[];
}

const BurnMetricsConcise: React.FC<BurnMetricsConciseProps> = ({ data = [] }) => {
  // If no data is provided, show a placeholder message
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Burn Analysis</h2>
        <p className="text-gray-500">No financial data available to analyze.</p>
      </div>
    );
  }
  
  // Get latest metrics
  const currentMonth = data[0];
  const latestBurnMultiple = currentMonth?.burnMultiple || 0;
  const currentRunway = currentMonth?.runway || 0;
  const currentBurn = currentMonth?.monthlyBurn || 0;
  
  // Calculate quarterly data for burn multiple chart
  const quarterlyBurnData: QuarterlyBurnData[] = calculateQuarterlyBurnData(data);
  
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Burn Analysis</h2>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Current Cash & Runway */}
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-blue-800">Cash Runway</p>
              <h3 className="text-2xl font-bold text-gray-800">{currentRunway} months</h3>
              <p className="text-sm text-gray-500 mt-1">
                {currentRunway >= 18 ? "Healthy position" : 
                 currentRunway >= 12 ? "Adequate runway" : 
                 "Consider fundraising soon"}
              </p>
            </div>
            <div className="p-2 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Monthly Burn Rate */}
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-red-800">Monthly Burn</p>
              <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(currentBurn)}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Net cash outflow per month
              </p>
            </div>
            <div className="p-2 rounded-full bg-red-100">
              <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Burn Multiple */}
        <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-purple-800">Burn Multiple</p>
              <h3 className="text-2xl font-bold" style={{ color: getBurnMultipleColor(latestBurnMultiple) }}>
                {formatBurnMultiple(latestBurnMultiple)}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {latestBurnMultiple <= 1 ? "Excellent efficiency" : 
                 latestBurnMultiple <= 2 ? "Good efficiency" : 
                 "High burn relative to growth"}
              </p>
            </div>
            <div className="p-2 rounded-full bg-purple-100">
              <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Burn Multiple Chart (Quarterly) - First */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2 text-gray-700">Quarterly Burn Multiple</h3>
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            {quarterlyBurnData.length > 0 ? (
              <BarChart
                data={quarterlyBurnData}
                margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="quarter" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 5]}
                  tickFormatter={(value) => `${value.toFixed(1)}x`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: any, name: any) => {
                    if (name === "Burn Multiple (Quarterly Avg)") return parseFloat(value).toFixed(1) + 'x';
                    return value;
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="burnMultiple" 
                  name="Burn Multiple (Quarterly Avg)" 
                  fill="#8b5cf6" 
                  maxBarSize={40}
                />
                <ReferenceLine 
                  y={1} 
                  stroke="#22c55e" 
                  strokeDasharray="3 3"
                  label={{ 
                    value: 'Excellent', 
                    position: 'right',
                    fill: '#22c55e',
                    fontSize: 10
                  }}
                />
                <ReferenceLine 
                  y={2} 
                  stroke="#facc15" 
                  strokeDasharray="3 3"
                  label={{ 
                    value: 'Good', 
                    position: 'right',
                    fill: '#facc15',
                    fontSize: 10
                  }}
                />
              </BarChart>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                <p className="text-gray-500">No quarterly burn data available</p>
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Cash & Runway Chart - Second */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2 text-gray-700">Cash & Runway</h3>
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 12 }}
                interval={data.length > 24 ? 2 : 1}
              />
              <YAxis 
                yAxisId="left"
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 12 }}
                label={{ value: 'Cash Balance', angle: -90, position: 'insideLeft', offset: -5, style: { textAnchor: 'middle', fill: '#3b82f6', fontSize: 12 } }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={[0, 'dataMax + 6']}
                tickFormatter={(value) => `${value}m`}
                tick={{ fontSize: 12 }}
                label={{ value: 'Runway (months)', angle: 90, position: 'insideRight', offset: 5, style: { textAnchor: 'middle', fill: '#f59e0b', fontSize: 12 } }}
              />
              <Tooltip 
                formatter={(value: any, name: any) => {
                  if (name === "Cash Balance") return formatCurrency(Number(value));
                  if (name === "Runway") return `${value} months`;
                  return value;
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="cash" 
                name="Cash Balance" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="runway" 
                name="Runway" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={false}
              />
              <ReferenceLine 
                y={12} 
                yAxisId="right"
                stroke="#f59e0b" 
                strokeDasharray="3 3"
                label={{ 
                  value: '12 Month', 
                  position: 'right',
                  fill: '#f59e0b',
                  fontSize: 10
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Quick explanation */}
      <div className="mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p><span className="font-medium">Burn Rate:</span> Monthly net cash outflow (expenses minus revenue)</p>
        <p><span className="font-medium">Runway:</span> How many months until cash runs out at current burn rate</p>
        <p><span className="font-medium">Burn Multiple:</span> Ratio of cash burn to new ARR growth (lower is better)</p>
      </div>
    </div>
  );
};

export default BurnMetricsConcise;
