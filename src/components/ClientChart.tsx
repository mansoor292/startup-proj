import React from 'react';
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, Label
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

interface ClientChartProps {
  data: any[];
  periodType: string;
  colors: any;
  CustomTooltip: any;
}

const ClientChart = ({ data, periodType, colors, CustomTooltip }: ClientChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {periodType === 'monthly' ? (
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
        >
          <defs>
            <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.clients.main} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors.clients.main} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
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
            tickFormatter={(value) => value.toLocaleString()}
            tick={{ fontSize: 12 }}
          >
            <Label 
              value="Clients" 
              position="insideLeft" 
              angle={-90} 
              offset={-5}
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <Tooltip content={CustomTooltip} />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="clients" 
            name="Clients" 
            stroke={colors.clients.main} 
            fillOpacity={1} 
            fill="url(#colorClients)" 
            strokeWidth={2}
          />
        </AreaChart>
      ) : (
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
        >
          <defs>
            <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.clients.main} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors.clients.main} stopOpacity={0.4}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 12 }}
          >
            <Label value="Timeline" position="insideBottom" offset={-15} />
          </XAxis>
          <YAxis 
            tickFormatter={(value) => value.toLocaleString()}
            tick={{ fontSize: 12 }}
          >
            <Label 
              value="Clients" 
              position="insideLeft" 
              angle={-90} 
              offset={-5}
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <Tooltip content={CustomTooltip} />
          <Legend />
          <Bar 
            dataKey="clients" 
            name="Clients" 
            fill="url(#colorClients)" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
};

export default ClientChart;
