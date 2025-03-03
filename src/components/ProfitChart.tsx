import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, Label, ReferenceLine
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

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  } else if (value < 0 && Math.abs(value) >= 1000) {
    return `-$${(Math.abs(value) / 1000).toFixed(1)}K`;
  } else {
    return `$${value}`;
  }
};

interface ProfitChartProps {
  data: any[];
  periodType: string;
  colors: any;
  CustomTooltip: any;
}

const ProfitChart = ({ data, periodType, colors, CustomTooltip }: ProfitChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {periodType === 'monthly' ? (
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.split(' ')[0]}
            interval={2}
          >
            <Label value="Timeline" position="insideBottom" offset={-15} />
          </XAxis>
          <YAxis 
            tickFormatter={(value) => formatCurrency(value)}
            tick={{ fontSize: 12 }}
          >
            <Label 
              value="Amount" 
              position="insideLeft" 
              angle={-90} 
              offset={-5}
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <Tooltip content={CustomTooltip} />
          <Legend />
          <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="profit" 
            name="Gross Profit" 
            stroke={colors.profit.main} 
            strokeWidth={2}
            dot={{ r: 1 }}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="marketingBudget" 
            name="Marketing Budget" 
            stroke={colors.marketing.main} 
            strokeWidth={2}
            dot={{ r: 1 }}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="netProfit" 
            name="Net Profit" 
            stroke="#ef4444" 
            strokeWidth={2}
            dot={{ r: 1 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      ) : (
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 12 }}
          >
            <Label value="Timeline" position="insideBottom" offset={-15} />
          </XAxis>
          <YAxis 
            tickFormatter={(value) => formatCurrency(value)}
            tick={{ fontSize: 12 }}
          >
            <Label 
              value="Amount" 
              position="insideLeft" 
              angle={-90} 
              offset={-5}
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <Tooltip content={CustomTooltip} />
          <Legend />
          <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
          <Bar 
            dataKey="profit" 
            name="Gross Profit" 
            fill={colors.profit.main} 
            radius={[4, 4, 0, 0]} 
          />
          <Bar 
            dataKey="marketingBudget" 
            name="Marketing Budget" 
            fill={colors.marketing.main} 
            radius={[4, 4, 0, 0]} 
          />
          <Bar 
            dataKey="netProfit" 
            name="Net Profit" 
            fill="#ef4444" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
};

export default ProfitChart;
