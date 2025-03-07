'use client';

import React from 'react';
import Inputs from '../types/Inputs';
import MonthlyData from '../types/MonthlyData';
import YearlyData from '../types/YearlyData';
import { calculateProjections } from '../utils/projectionCalculator';

interface CalculatorProps {
  inputs: Inputs;
  setProjectionData: (data: MonthlyData[]) => void;
  setSummaryMetrics: (data: YearlyData[]) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ inputs, setProjectionData, setSummaryMetrics }) => {
  React.useEffect(() => {
    // Use our shared utility function to calculate projections
    const { monthlyData, yearlyData } = calculateProjections(inputs);
    
    // Update state with the calculated data
    setProjectionData(monthlyData);
    setSummaryMetrics(yearlyData);
  }, [inputs, setProjectionData, setSummaryMetrics]);

  return null; // This component doesn't render anything directly
};

export default Calculator;
