import Inputs from '@/types/Inputs';
import MonthlyData from '@/types/MonthlyData';
import YearlyData from '@/types/YearlyData';

// Calculate marketing budget with proper reinvestment during seed period
function calculateMarketingBudget(
  month: number,
  seedMarketingMonths: number,
  monthlySeedBudget: number,
  netProfit: number,
  marketingReinvestmentPercentage: number
): number {
  let monthlyMarketingBudget = 0;
  
  if (month < seedMarketingMonths) {
    // During seed period: use seed budget + reinvestment
    const reinvestmentAmount = netProfit * (marketingReinvestmentPercentage / 100);
    monthlyMarketingBudget = monthlySeedBudget + Math.max(0, reinvestmentAmount);
  } else {
    // After seed period: use only reinvestment
    monthlyMarketingBudget = netProfit * (marketingReinvestmentPercentage / 100);
  }
  
  // Ensure marketing budget is never negative
  return Math.max(0, monthlyMarketingBudget);
}

// Calculate projections based on input parameters
export function calculateProjections(inputs: Inputs): { monthlyData: MonthlyData[], yearlyData: YearlyData[] } {
  const {
    initialClients,
    monthlyRevenuePerClient,
    cac,
    churnRate,
    salesCycleLengthMonths,
    grossMarginPercentage,
    marketingReinvestmentPercentage,
    seedMarketingBudget,
    seedMarketingMonths,
    useSCurveModel
  } = inputs;

  // Get S-curve parameters with defaults
  const totalAddressableMarket = inputs.totalAddressableMarket || 1000000;
  const earlyAdopterCeiling = inputs.earlyAdopterCeiling || 0.16;
  const mainMarketResistance = inputs.mainMarketResistance || 1.5;
  const competitiveResponseThreshold = inputs.competitiveResponseThreshold || 50000;
  const competitiveResponseImpact = inputs.competitiveResponseImpact || 1.4;
  const channelSaturationRate = inputs.channelSaturationRate || 0.01;
  const fixedCosts = inputs.fixedCosts || 0;
  const initialCash = inputs.initialCash || 0;

  // Convert annual churn to monthly
  const monthlyChurnRate = churnRate / 12;
  
  // Initialize projection data
  const months = 12 * 5; // 5 years
  let monthlyData: MonthlyData[] = [];

  // If S-curve model is enabled
  if (useSCurveModel) {    
    // Use S-curve model for projections
    const monthlySeedBudget = seedMarketingBudget / seedMarketingMonths;
    
    monthlyData = projectSCurveGrowth({
      initialCustomers: initialClients,
      totalAddressableMarket: totalAddressableMarket,
      marketingBudgetMonthly: monthlySeedBudget,
      initialCAC: cac,
      months: months,
      earlyAdopterCeiling: earlyAdopterCeiling,
      mainMarketResistance: mainMarketResistance,
      competitiveResponseThreshold: competitiveResponseThreshold,
      competitiveResponseImpact: competitiveResponseImpact,
      channelSaturationRate: channelSaturationRate,
      monthlyChurnRate: monthlyChurnRate,
      monthlyRevenuePerClient: monthlyRevenuePerClient,
      grossMarginPercentage: grossMarginPercentage,
      salesCycleLengthMonths: salesCycleLengthMonths,
      fixedCosts: fixedCosts,
      initialCash: initialCash,
      marketingReinvestmentPercentage: marketingReinvestmentPercentage,
      seedMarketingMonths: seedMarketingMonths
    });
  } else {
    // Use original linear growth model
    let currentClients = initialClients;
    let monthlySeedBudget = seedMarketingBudget / seedMarketingMonths; // Seed budget distributed monthly
    let cumulativeNewClientsInPipeline = new Array(salesCycleLengthMonths).fill(0);
    let cumulativeRevenue = 0;
    let cumulativeProfit = 0;
    let cash = initialCash;

    // Calculate monthly projections
    for (let month = 0; month < months; month++) {
      // Calculate revenue for the current month
      const monthlyRevenue = currentClients * monthlyRevenuePerClient;

      // Calculate gross profit
      const grossProfit = monthlyRevenue * (grossMarginPercentage / 100);
      
      // Calculate net profit (after fixed costs)
      const netProfit = grossProfit - fixedCosts;

      // Calculate marketing budget using the shared function
      const monthlyMarketingBudget = calculateMarketingBudget(
        month,
        seedMarketingMonths,
        monthlySeedBudget,
        netProfit,
        marketingReinvestmentPercentage
      );

      // Calculate new clients from marketing spend
      const potentialNewClients = monthlyMarketingBudget / cac;

      // Distribute new clients across sales cycle
      cumulativeNewClientsInPipeline.push(potentialNewClients);
      const newClientsThisMonth = cumulativeNewClientsInPipeline.shift() as number;

      // Calculate churn
      const lostClientsThisMonth = currentClients * (monthlyChurnRate / 100);

      // Update current clients
      currentClients = currentClients + newClientsThisMonth - lostClientsThisMonth;

      // Update cumulative metrics
      cumulativeRevenue += monthlyRevenue;
      cumulativeProfit += grossProfit;

      // Calculate customer LTV (Lifetime Value)
      // LTV = Monthly Revenue per Client * Gross Margin % * Average Lifetime (in months)
      // Average Lifetime = 1 / Monthly Churn Rate
      const averageLifetimeMonths = 100 / monthlyChurnRate;
      const customerLTV = monthlyRevenuePerClient * (grossMarginPercentage / 100) * averageLifetimeMonths;

      // Calculate LTV to CAC ratio
      const ltvToCacRatio = customerLTV / cac;

      // Calculate final profit after marketing spend
      const finalProfit = netProfit - monthlyMarketingBudget;

      // Calculate total costs
      const totalCosts = (monthlyRevenue - grossProfit) + fixedCosts + monthlyMarketingBudget + (cac * newClientsThisMonth);

      // Calculate cash balance
      cash += finalProfit;

      // Calculate runway
      const runway = cash > 0 && totalCosts > monthlyRevenue ? Math.floor(cash / (totalCosts - monthlyRevenue)) : (cash > 0 ? Infinity : 0);
      const monthlyBurn = totalCosts - monthlyRevenue;

      // Calculate net new ARR (Annual Recurring Revenue)
      let netNewARR = monthlyRevenue * 12; // Default value
      if (month >= 4 && monthlyData.length >= 4) {
        netNewARR = (monthlyRevenue - monthlyData[month - 4].revenue) * 12 / 3;
      }

      // Calculate burn multiple
      const burnMultiple = netNewARR > 0 ?
        (totalCosts - monthlyRevenue) / (netNewARR / 12) :
        Infinity;

      // Prepare data for this month
      const year = Math.floor(month / 12) + 1;
      const monthOfYear = (month % 12) + 1;

      monthlyData.push({
        month: month + 1,
        label: `Y${year}M${monthOfYear}`,
        clients: Math.round(currentClients),
        revenue: Math.round(monthlyRevenue),
        profit: Math.round(grossProfit), // This is now gross profit
        marketingBudget: Math.round(monthlyMarketingBudget),
        netProfit: Math.round(finalProfit),
        newClients: Math.round(newClientsThisMonth),
        churnedClients: Math.round(lostClientsThisMonth),
        cumulativeRevenue: Math.round(cumulativeRevenue),
        cumulativeProfit: Math.round(cumulativeProfit),
        seedBudgetRemaining: month < seedMarketingMonths ?
          seedMarketingBudget - (month + 1) * monthlySeedBudget : 0,
        customerLTV: Math.round(customerLTV),
        ltvToCacRatio: Math.round(ltvToCacRatio * 10) / 10,
        burnMultiple: burnMultiple < 0 ? 0 : burnMultiple, // Ensure burnMultiple is not negative
        cash,
        runway,
        monthlyBurn
      });
    }
  }

  // Calculate summary metrics for the end of each year
  const yearlyData: YearlyData[] = [];
  for (let year = 1; year <= 5; year++) {
    const yearEndMonth = year * 12 - 1;
    if (yearEndMonth >= monthlyData.length) continue; // Skip if not enough data
    
    const yearMonths = monthlyData.slice(yearEndMonth - 11, yearEndMonth + 1);

    const annualRevenue = yearMonths.reduce((sum, month) => sum + month.revenue, 0);
    const annualProfit = yearMonths.reduce((sum, month) => sum + month.profit, 0);
    const annualMarketingSpend = yearMonths.reduce((sum, month) => sum + month.marketingBudget, 0);
    const annualNetProfit = yearMonths.reduce((sum, month) => sum + month.netProfit, 0);

    yearlyData.push({
      year,
      clients: monthlyData[yearEndMonth].clients,
      annualRevenue,
      annualProfit,
      annualMarketingSpend,
      annualNetProfit,
      customerLTV: monthlyData[yearEndMonth].customerLTV,
      ltvToCacRatio: monthlyData[yearEndMonth].ltvToCacRatio,
      cacPaybackMonths: Math.round(cac / (monthlyRevenuePerClient * (grossMarginPercentage / 100))),
      cash: monthlyData[yearEndMonth].cash ?? 0
    });
  }

  return { monthlyData, yearlyData };
}

// S-Curve Growth Model implementation
export function projectSCurveGrowth(params: {
  initialCustomers: number;
  totalAddressableMarket: number;
  marketingBudgetMonthly: number;
  initialCAC: number;
  months: number;
  earlyAdopterCeiling: number;
  mainMarketResistance: number;
  competitiveResponseThreshold: number;
  competitiveResponseImpact: number;
  channelSaturationRate: number;
  monthlyChurnRate: number;
  monthlyRevenuePerClient: number;
  grossMarginPercentage: number;
  salesCycleLengthMonths: number;
  fixedCosts: number;
  initialCash: number;
  marketingReinvestmentPercentage: number;
  seedMarketingMonths: number;
}): MonthlyData[] {
  const {
    initialCustomers,
    totalAddressableMarket,
    marketingBudgetMonthly,
    initialCAC,
    months,
    earlyAdopterCeiling,
    mainMarketResistance,
    competitiveResponseThreshold,
    competitiveResponseImpact,
    channelSaturationRate,
    monthlyChurnRate,
    monthlyRevenuePerClient,
    grossMarginPercentage,
    salesCycleLengthMonths,
    fixedCosts,
    initialCash
  } = params;

  // Initialize tracking arrays
  const data: MonthlyData[] = [];
  let currentClients = initialCustomers;
  let cumulativeNewClientsInPipeline = new Array(salesCycleLengthMonths).fill(0);
  let cumulativeRevenue = 0;
  let cumulativeProfit = 0;
  let cash = initialCash;

  for (let month = 0; month < months; month++) {
    // Calculate current market penetration
    const penetrationRate = currentClients / totalAddressableMarket;
    
    // CHECKPOINT 1: Apply S-curve dampening as we approach TAM
    // This creates the characteristic sigmoid shape
    // Use a more aggressive dampening formula that kicks in more noticeably
    const tamProximityFactor = 1 - Math.pow(penetrationRate * 10, 2);
    
    // CHECKPOINT 2: Different resistance at market penetration thresholds
    let marketPhaseFactor = 1;
    if (penetrationRate > earlyAdopterCeiling) {
      marketPhaseFactor = mainMarketResistance; // Harder to convince mainstream market
    }
    
    // CHECKPOINT 3: Diminishing returns on marketing spend
    // Create a more pronounced S-curve with acceleration and deceleration phases
    let diminishingReturnFactor;
    if (month < 6) {
      // First 6 months: very slow start
      diminishingReturnFactor = Math.pow(0.8, (6 - month) / 3);
    } else if (month < 18) {
      // Next 12 months: rapid acceleration
      diminishingReturnFactor = Math.pow(1.5, (month - 6) / 6);
    } else if (month < 36) {
      // Next 18 months: continued growth but slowing
      diminishingReturnFactor = Math.pow(1.2, (month - 18) / 9);
    } else {
      // Later years: efficiency drops
      diminishingReturnFactor = Math.pow(0.7, (month - 36) / 12);
    }
    
    // CHECKPOINT 4: Competitive response
    let competitiveFactor = 1;
    if (currentClients > competitiveResponseThreshold) {
      competitiveFactor = competitiveResponseImpact; // Competitors fight back
    }
    
    // CHECKPOINT 5: Channel saturation
    const channelEfficiency = Math.max(0.5, 1 - (month * channelSaturationRate));
    
    // Calculate effective CAC based on all factors
    const effectiveCAC = initialCAC * 
                        marketPhaseFactor * 
                        competitiveFactor / 
                        (diminishingReturnFactor * channelEfficiency);
    
    // Calculate monthly revenue
    const monthlyRevenue = currentClients * monthlyRevenuePerClient;
    
    // Calculate gross profit (changed from net margin)
    const grossProfit = monthlyRevenue * (grossMarginPercentage / 100);
    
    // Calculate net profit (after fixed costs)
    const netProfit = grossProfit - fixedCosts;
    
    // Calculate marketing budget using the shared function
    const monthlyMarketingBudget = calculateMarketingBudget(
      month,
      params.seedMarketingMonths,
      marketingBudgetMonthly,
      netProfit,
      params.marketingReinvestmentPercentage
    );
    
    // Calculate new clients from marketing spend with S-curve factors
    const budgetedNewClients = monthlyMarketingBudget / effectiveCAC;
    
    // Apply TAM proximity constraint (creates the upper part of the S)
    const potentialNewClients = budgetedNewClients * tamProximityFactor;
    
    // Distribute new clients across sales cycle (same as original model)
    cumulativeNewClientsInPipeline.push(potentialNewClients);
    const newClientsThisMonth = cumulativeNewClientsInPipeline.shift() as number;
    
    // Calculate churn
    const lostClientsThisMonth = currentClients * (monthlyChurnRate / 100);
    
    // Update current clients
    currentClients = currentClients + newClientsThisMonth - lostClientsThisMonth;
    
    // Update cumulative metrics
    cumulativeRevenue += monthlyRevenue;
    cumulativeProfit += grossProfit;
    
    // Calculate customer LTV
    const averageLifetimeMonths = 100 / monthlyChurnRate;
    const customerLTV = monthlyRevenuePerClient * (grossMarginPercentage / 100) * averageLifetimeMonths;
    
    // Calculate LTV to CAC ratio
    const ltvToCacRatio = customerLTV / effectiveCAC;
    
    // Calculate final profit after marketing spend
    const finalProfit = netProfit - monthlyMarketingBudget;
    
    // Calculate total costs
    const totalCosts = (monthlyRevenue - grossProfit) + fixedCosts + monthlyMarketingBudget + (effectiveCAC * newClientsThisMonth);
    
    // Calculate cash balance
    cash += finalProfit;
    
    // Calculate runway
    const runway = cash > 0 && totalCosts > monthlyRevenue ? 
                  Math.floor(cash / (totalCosts - monthlyRevenue)) : 
                  (cash > 0 ? Infinity : 0);
    const monthlyBurn = totalCosts - monthlyRevenue;
    
    // Calculate net new ARR (Annual Recurring Revenue)
    let netNewARR = monthlyRevenue * 12; // Default value
    if (month >= 4 && data.length >= 4) {
      netNewARR = (monthlyRevenue - data[month - 4].revenue) * 12 / 3;
    }
    
    // Calculate burn multiple
    const burnMultiple = netNewARR > 0 ?
      (totalCosts - monthlyRevenue) / (netNewARR / 12) :
      Infinity;
    
    // Prepare data for this month
    const year = Math.floor(month / 12) + 1;
    const monthOfYear = (month % 12) + 1;
    
    data.push({
      month: month + 1,
      label: `Y${year}M${monthOfYear}`,
      clients: Math.round(currentClients),
      revenue: Math.round(monthlyRevenue),
      profit: Math.round(grossProfit), // This is now gross profit
      marketingBudget: Math.round(monthlyMarketingBudget),
      netProfit: Math.round(finalProfit),
      newClients: Math.round(newClientsThisMonth),
      churnedClients: Math.round(lostClientsThisMonth),
      cumulativeRevenue: Math.round(cumulativeRevenue),
      cumulativeProfit: Math.round(cumulativeProfit),
      seedBudgetRemaining: 0, // Not applicable in S-curve model
      customerLTV: Math.round(customerLTV),
      ltvToCacRatio: Math.round(ltvToCacRatio * 10) / 10,
      burnMultiple: burnMultiple < 0 ? 0 : burnMultiple,
      cash,
      runway,
      monthlyBurn,
      // S-curve specific metrics
      penetrationRate: penetrationRate * 100, // Convert to percentage
      effectiveCAC: Math.round(effectiveCAC),
      tamProximityFactor: Math.round(tamProximityFactor * 100) / 100
    });
  }
  
  return data;
}
