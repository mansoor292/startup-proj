interface Inputs {
  initialClients: number;
  monthlyRevenuePerClient: number;
  cac: number;
  churnRate: number;
  salesCycleLengthMonths: number;
  grossMarginPercentage: number;
  marketingReinvestmentPercentage: number;
  seedMarketingBudget: number;
  seedMarketingMonths: number;
  scenarioName: string;
  fixedCosts?: number;
  initialCash?: number;
  
  // S-curve model parameters
  useSCurveModel?: boolean;
  totalAddressableMarket?: number;
  earlyAdopterCeiling?: number;
  mainMarketResistance?: number;
  competitiveResponseThreshold?: number;
  competitiveResponseImpact?: number;
  channelSaturationRate?: number;
}

export default Inputs;
