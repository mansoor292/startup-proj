import React from 'react';
import Inputs from '../types/Inputs';
import MonthlyData from '../types/MonthlyData';
import YearlyData from '../types/YearlyData';

interface CalculatorProps {
  inputs: Inputs;
  setProjectionData: (data: MonthlyData[]) => void;
  setSummaryMetrics: (data: YearlyData[]) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ inputs, setProjectionData, setSummaryMetrics }) => {
  const calculateProjection = () => {
    const {
      initialClients,
      monthlyRevenuePerClient,
      cac,
      churnRate,
      salesCycleLengthMonths,
      netMarginPercentage,
      marketingReinvestmentPercentage,
      seedMarketingBudget,
      seedMarketingMonths
    } = inputs;

    // Convert annual churn to monthly
    const monthlyChurnRate = churnRate / 12;

    // Initialize projection data
    const months = 12 * 5; // 5 years
    const data: MonthlyData[] = [];

    let currentClients = initialClients;
    let monthlySeedBudget = seedMarketingBudget / seedMarketingMonths; // Seed budget distributed monthly
    let cumulativeNewClientsInPipeline = new Array(salesCycleLengthMonths).fill(0);
    let cumulativeRevenue = 0;
    let cumulativeProfit = 0;

    // Calculate monthly projections
    for (let month = 0; month < months; month++) {
      // Calculate revenue for the current month
      const monthlyRevenue = currentClients * monthlyRevenuePerClient;

      // Calculate profit
      const monthlyProfit = monthlyRevenue * (netMarginPercentage / 100);

      // Calculate marketing budget
      let monthlyMarketingBudget = 0;

      // If within seed marketing period, use seed budget
      if (month < seedMarketingMonths) {
        monthlyMarketingBudget = monthlySeedBudget;
      } else {
        // Otherwise, use reinvestment from profit
        monthlyMarketingBudget = monthlyProfit * (marketingReinvestmentPercentage / 100);
      }

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
      cumulativeProfit += monthlyProfit;

      // Calculate customer LTV (Lifetime Value)
      // LTV = Monthly Revenue per Client * Net Margin % * Average Lifetime (in months)
      // Average Lifetime = 1 / Monthly Churn Rate
      const averageLifetimeMonths = 100 / monthlyChurnRate;
      const customerLTV = monthlyRevenuePerClient * (netMarginPercentage / 100) * averageLifetimeMonths;

      // Calculate LTV to CAC ratio
      const ltvToCacRatio = customerLTV / cac;

      // Calculate net profit
      const netProfit = monthlyProfit - monthlyMarketingBudget;

      // Prepare data for this month
      const year = Math.floor(month / 12) + 1;
      const monthOfYear = (month % 12) + 1;

      data.push({
        month: month + 1,
        label: `Y${year}M${monthOfYear}`,
        clients: Math.round(currentClients * 100) / 100,
        revenue: Math.round(monthlyRevenue),
        profit: Math.round(monthlyProfit),
        marketingBudget: Math.round(monthlyMarketingBudget),
        netProfit: Math.round(netProfit),
        newClients: Math.round(newClientsThisMonth * 100) / 100,
        churnedClients: Math.round(lostClientsThisMonth * 100) / 100,
        cumulativeRevenue: Math.round(cumulativeRevenue),
        cumulativeProfit: Math.round(cumulativeProfit),
        seedBudgetRemaining: month < seedMarketingMonths ?
          seedMarketingBudget - (month + 1) * monthlySeedBudget : 0,
        customerLTV: Math.round(customerLTV),
        ltvToCacRatio: Math.round(ltvToCacRatio * 10) / 10
      });
    }

    setProjectionData(data);

    // Calculate summary metrics for the end of each year
    const yearlyData: YearlyData[] = [];
    for (let year = 1; year <= 5; year++) {
      const yearEndMonth = year * 12 - 1;
      const yearMonths = data.slice(yearEndMonth - 11, yearEndMonth + 1);

      const annualRevenue = yearMonths.reduce((sum, month) => sum + month.revenue, 0);
      const annualProfit = yearMonths.reduce((sum, month) => sum + month.profit, 0);
      const annualMarketingSpend = yearMonths.reduce((sum, month) => sum + month.marketingBudget, 0);
      const annualNetProfit = yearMonths.reduce((sum, month) => sum + month.netProfit, 0);

      yearlyData.push({
        year,
        clients: data[yearEndMonth].clients,
        annualRevenue,
        annualProfit,
        annualMarketingSpend,
        annualNetProfit,
        customerLTV: data[yearEndMonth].customerLTV,
        ltvToCacRatio: data[yearEndMonth].ltvToCacRatio,
        cacPaybackMonths: Math.round(cac / (monthlyRevenuePerClient * (netMarginPercentage / 100)))
      });
    }

    setSummaryMetrics(yearlyData);
  };

  React.useEffect(() => {
    calculateProjection();
  }, [inputs]);

  return null; // This component doesn't render anything directly
};

export default Calculator;
