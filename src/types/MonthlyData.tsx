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
  burnMultiple?: number;
  cash?: number;
  runway?: number;
  monthlyBurn?: number;
  
  // S-curve specific metrics
  penetrationRate?: number;
  effectiveCAC?: number;
  tamProximityFactor?: number;
  }

export default MonthlyData;
