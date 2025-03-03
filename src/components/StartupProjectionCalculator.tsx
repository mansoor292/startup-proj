'use client';

import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from './Card';
import CardHeader from './CardHeader';
import CardTitle from './CardTitle';
import CardContent from './CardContent';
import Inputs from '../types/Inputs';
import MonthlyData from '../types/MonthlyData';
import YearlyData from '../types/YearlyData';
import ProjectionTableViz from './ProjectionTableViz';
import Calculator from './Calculator';
import ModernCharts from './ProjectionCharts';

interface TabPanelProps {
  children?: React.ReactNode;
  index?: any;
  value?: any;
}

// Main Component
const StartupProjectionCalculator: React.FC = () => {
  // Input state - initial default values
  const defaultInputs: Inputs = {
    initialClients: 10,
    monthlyRevenuePerClient: 1000,
    cac: 5000,
    churnRate: 5.5, // Annualized percentage
    salesCycleLengthMonths: 3,
    netMarginPercentage: 30,
    marketingReinvestmentPercentage: 50,
    seedMarketingBudget: 1000000,
    seedMarketingMonths: 6,
    scenarioName: "Default Scenario",
  };

  // State
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);
  const [projectionData, setProjectionData] = useState<MonthlyData[]>([]);
  const [summaryMetrics, setSummaryMetrics] = useState<YearlyData[]>([]);
  const [savedScenarios, setSavedScenarios] = useState<{[key: string]: Inputs}>({});
  const [showSavedScenarios, setShowSavedScenarios] = useState(false);
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

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle scenario name as string, everything else as number
    const newValue = name === 'scenarioName' ? value : parseFloat(value);

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
  const getShareableLink = () => {
    const scenarioStr = btoa(JSON.stringify(inputs));
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('scenario', scenarioStr);
      return url.toString();
    }
    return '';
  };

  return (
    <>
      <Calculator
        inputs={inputs}
        setProjectionData={setProjectionData}
        setSummaryMetrics={setSummaryMetrics}
      />
      <Card className="p-6 max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-6 text-center">5-Year Startup Projection Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Scenario Management */}
          <div className="mb-6 flex flex-wrap gap-3 justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="scenarioName"
                value={inputs.scenarioName}
                onChange={handleInputChange}
                placeholder="Scenario Name"
                className="p-2 border rounded"
              />
              <button
                onClick={saveScenario}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
              >
                Save Scenario
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSavedScenarios(!showSavedScenarios)}
                className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700"
              >
                {showSavedScenarios ? 'Hide Saved' : 'Show Saved'} ({Object.keys(savedScenarios).length})
              </button>

              <button
                onClick={resetToDefaults}
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
              >
                Reset to Defaults
              </button>

              <button
                onClick={() => {
                  const link = getShareableLink();
                  navigator.clipboard.writeText(link);
                  alert('Shareable link copied to clipboard!');
                }}
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Saved Scenarios Dropdown */}
          {showSavedScenarios && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Saved Scenarios</h3>
              {Object.keys(savedScenarios).length === 0 ? (
                <p>No saved scenarios yet. Save one using the form above.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.keys(savedScenarios).map((name) => (
                    <div
                      key={name}
                      onClick={() => loadScenario(name)}
                      className="p-3 bg-white border rounded-lg cursor-pointer hover:bg-blue-50 flex justify-between items-center"
                    >
                      <span>{name}</span>
                      <button
                        onClick={(e) => deleteScenario(name, e)}
                        className="text-red-600 hover:text-red-800 text-lg"
                        title="Delete Scenario"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <Tabs>
            <TabList>
              <Tab>Production Table</Tab>
              <Tab>Charts</Tab>
            </TabList>

            <TabPanel>
              {/* Input Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Business Inputs</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Initial Clients</label>
                      <input
                        type="number"
                        name="initialClients"
                        value={inputs.initialClients}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Monthly Revenue/Client ($)</label>
                      <input
                        type="number"
                        name="monthlyRevenuePerClient"
                        value={inputs.monthlyRevenuePerClient}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">CAC ($)</label>
                      <input
                        type="number"
                        name="cac"
                        value={inputs.cac}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Annual Churn Rate (%)</label>
                      <input
                        type="number"
                        name="churnRate"
                        value={inputs.churnRate}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Financial Inputs</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Sales Cycle (Months)</label>
                      <input
                        type="number"
                        name="salesCycleLengthMonths"
                        value={inputs.salesCycleLengthMonths}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Net Margin (%)</label>
                      <input
                        type="number"
                        name="netMarginPercentage"
                        value={inputs.netMarginPercentage}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div className="col-span-2 mt-2 bg-blue-50 p-2 rounded text-sm">
                      <div className="font-medium">Investment Metrics:</div>
                      <div className="flex justify-between mt-1">
                        <span>Customer LTV: ${(inputs.monthlyRevenuePerClient * (inputs.netMarginPercentage / 100) * (12 / (inputs.churnRate / 100))).toFixed(0)}</span>
                        <span>LTV:CAC Ratio: {(inputs.monthlyRevenuePerClient * (inputs.netMarginPercentage / 100) * (12 / (inputs.churnRate / 100)) / inputs.cac).toFixed(1)}x</span>
                        <span>CAC Payback: {Math.round(inputs.cac / (inputs.monthlyRevenuePerClient * (inputs.netMarginPercentage / 100)))} months</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Marketing Reinvestment (%)</label>
                      <input
                        type="number"
                        name="marketingReinvestmentPercentage"
                        value={inputs.marketingReinvestmentPercentage}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Seed Marketing Budget ($)</label>
                      <input
                        type="number"
                        name="seedMarketingBudget"
                        value={inputs.seedMarketingBudget}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Seed Period (Months)</label>
                      <input
                        type="number"
                        name="seedMarketingMonths"
                        value={inputs.seedMarketingMonths}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">5-Year Projection Summary</h2>
              {summaryMetrics.length > 0 && (
                <ProjectionTableViz projectionData={summaryMetrics} />
              )}
            </div>
          </TabPanel>
          <TabPanel>
              {/* Charts Section */}
              <ModernCharts
                projectionData={projectionData}
                periodType={periodType}
                colors={colors}
              />
            </TabPanel>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}

export default StartupProjectionCalculator;
