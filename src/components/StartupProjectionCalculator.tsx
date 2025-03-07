'use client';

import React, { useState, useEffect } from 'react';
import Card from './Card';
import CardContent from './CardContent';
import Inputs from '../types/Inputs';
import MonthlyData from '../types/MonthlyData';
import YearlyData from '../types/YearlyData';
import Calculator from './Calculator';
import ScenarioManager from './ScenarioManager';
import SavedScenariosList from './SavedScenariosList';
import AdvancedModelToggle from './AdvancedModelToggle';
import InputFields from './InputFields';
import ProjectionTabs from './ProjectionTabs';
import { formatNumberWithCommas, parseFormattedNumber, downloadCSV as utilsDownloadCSV } from '../utils/calculatorUtils';
import HtmlChartButton from './HtmlChartButton';

// Main Component
const StartupProjectionCalculator: React.FC = () => {
  // Input state - initial default values
  const defaultInputs: Inputs = {
    initialClients: 100,
    monthlyRevenuePerClient: 2000,
    cac: 10000,
    churnRate: 5.5, // Annualized percentage
    salesCycleLengthMonths: 3,
    grossMarginPercentage: 30,
    marketingReinvestmentPercentage: 50,
    seedMarketingBudget: 2000000,
    seedMarketingMonths: 6,
    scenarioName: "Default Scenario",
    
    // S-curve model parameters (disabled by default)
    useSCurveModel: false,
    totalAddressableMarket: 1000000,
    earlyAdopterCeiling: 0.16, // Early adopters = ~16% of market
    mainMarketResistance: 1.5, // 50% harder to convert mainstream market
    competitiveResponseThreshold: 50000, // Competitors respond at 5% market share
    competitiveResponseImpact: 1.4, // 40% increase in CAC due to competition
    channelSaturationRate: 0.01, // 1% efficiency decrease per month
  };

  // State
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);
  const [projectionData, setProjectionData] = useState<MonthlyData[]>([]);
  const [summaryMetrics, setSummaryMetrics] = useState<YearlyData[]>([]);
  const [savedScenarios, setSavedScenarios] = useState<{[key: string]: Inputs}>({});
  const [showSavedScenarios, setShowSavedScenarios] = useState(false);
  const [showLinkOptions, setShowLinkOptions] = useState(false);
  const [periodType, setPeriodType] = useState<string>('annual');

  const colors = {
    revenue: {
      main: '#007bff',
      light: '#b3d9ff',
      gradient: ['#e6f2ff', '#007bff'],
    },
    profit: {
      main: '#28a745',
      light: '#90ee90',
      gradient: ['#dfffdf', '#28a745'],
    },
    clients: {
      main: '#ffc107',
      light: '#ffe58f',
      gradient: ['#fff9e6', '#ffc107'],
    },
    marketing: {
      main: '#6f42c1',
      light: '#c7b3ff',
      gradient: ['#f2e6ff', '#6f42c1'],
    },
  };

  // Load params from URL on initial load
  useEffect(() => {
    try {
      // Parse URL parameters
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const scenarioParam = urlParams.get('scenario');

        if (scenarioParam) {
          const decodedScenario = JSON.parse(atob(scenarioParam));
          setInputs(prev => ({
            ...prev,
            ...decodedScenario
          }));
        }

        // Load saved scenarios from localStorage
        const savedScenariosStr = localStorage.getItem('savedScenarios');
        if (savedScenariosStr) {
          setSavedScenarios(JSON.parse(savedScenariosStr));
        }
      }
    } catch (error) {
      console.error('Error parsing URL parameters:', error);
    }
  }, []);

  // Get formatted value for display
  const getFormattedValue = (name: string): string => {
    if (name === 'scenarioName') return inputs.scenarioName;
    
    const value = inputs[name as keyof Inputs];
    if (typeof Number(value) === 'number' && !isNaN(Number(value))) {
      return formatNumberWithCommas(Number(value));
    }
    return '';
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle scenario name as string, everything else as number
    let newValue: string | number = value;
    
    if (name !== 'scenarioName') {
      // Remove commas and convert to number
      newValue = value === '' ? 0 : parseFormattedNumber(value);
    }

    setInputs(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  // Handle save scenario to localStorage and update URL
  const saveScenario = () => {
    const newSavedScenarios = {
      ...savedScenarios,
      [inputs.scenarioName]: {...inputs}
    };

    // Save to localStorage
    localStorage.setItem('savedScenarios', JSON.stringify(newSavedScenarios));
    setSavedScenarios(newSavedScenarios);

    // Update URL with encoded parameters
    const scenarioStr = btoa(JSON.stringify(inputs));

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('scenario', scenarioStr);
      window.history.pushState({}, '', url.toString());
    }
  };

  // Load a saved scenario
  const loadScenario = (scenarioName: string) => {
    if (savedScenarios[scenarioName]) {
      setInputs(savedScenarios[scenarioName]);
      setShowSavedScenarios(false);

      // Update URL
      const scenarioStr = btoa(JSON.stringify(savedScenarios[scenarioName]));
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('scenario', scenarioStr);
        window.history.pushState({}, '', url.toString());
      }
    }
  };

  // Delete a saved scenario
  const deleteScenario = (scenarioName: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering loadScenario

    const newSavedScenarios = {...savedScenarios};
    delete newSavedScenarios[scenarioName];

    // Update localStorage
    localStorage.setItem('savedScenarios', JSON.stringify(newSavedScenarios));
    setSavedScenarios(newSavedScenarios);
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setInputs(defaultInputs);

    // Remove URL parameters
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.search = '';
      window.history.pushState({}, '', url.toString());
    }
  };

  // Get shareable link
  const getShareableLink = async (shorten: boolean = true) => {
    const scenarioStr = btoa(JSON.stringify(inputs));
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('scenario', scenarioStr);
      let longURL = url.toString();

      if (shorten) {
        try {
          const apiURL = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longURL)}`;
          const response = await fetch(apiURL);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const shortURL = await response.text();
          return shortURL;
        } catch (error) {
          console.error("Could not shorten URL:", error);
          return longURL;
        }
      }
      return longURL;
    }
    return '';
  };

  // Function to trigger the CSV download
  const downloadCSV = () => {
    utilsDownloadCSV(projectionData);
  };

  return (
    <>
      <Calculator
        inputs={inputs}
        setProjectionData={setProjectionData}
        setSummaryMetrics={setSummaryMetrics}
      />
      <Card className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto rounded-xl shadow-xl border border-slate-100 bg-white">
        <CardContent>
          {/* Scenario Management */}
          <ScenarioManager 
            inputs={inputs}
            handleInputChange={handleInputChange}
            saveScenario={saveScenario}
            resetToDefaults={resetToDefaults}
            setShowSavedScenarios={setShowSavedScenarios}
            showSavedScenarios={showSavedScenarios}
            savedScenarios={savedScenarios}
            setShowLinkOptions={setShowLinkOptions}
            showLinkOptions={showLinkOptions}
            getShareableLink={getShareableLink}
          />

          {/* Saved Scenarios Dropdown */}
          <SavedScenariosList 
            showSavedScenarios={showSavedScenarios}
            savedScenarios={savedScenarios}
            loadScenario={loadScenario}
            deleteScenario={deleteScenario}
          />
          
          {/* HTML Chart Button */}
          <div className="mb-4 flex justify-end">
            <HtmlChartButton inputs={inputs} />
          </div>

          <ProjectionTabs 
            projectionData={projectionData}
            summaryMetrics={summaryMetrics}
            periodType={periodType}
            colors={colors}
            downloadCSV={downloadCSV}
          >
            {/* Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* S-Curve Model Toggle */}
              <AdvancedModelToggle 
                inputs={inputs}
                setInputs={setInputs}
                handleInputChange={handleInputChange}
                getFormattedValue={getFormattedValue}
              />
              <InputFields 
                inputs={inputs}
                handleInputChange={handleInputChange}
                getFormattedValue={getFormattedValue}
              />
            </div>
          </ProjectionTabs>
        </CardContent>
      </Card>
    </>
  );
}

export default StartupProjectionCalculator;
