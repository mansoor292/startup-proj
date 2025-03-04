interface Inputs {
  initialClients: number;
  monthlyRevenuePerClient: number;
  cac: number;
  churnRate: number;
  salesCycleLengthMonths: number;
  netMarginPercentage: number;
  marketingReinvestmentPercentage: number;
  seedMarketingBudget: number;
  seedMarketingMonths: number;
  scenarioName: string;
  fixedCosts?: number;
  initialCash?: number;
}

export default Inputs;
