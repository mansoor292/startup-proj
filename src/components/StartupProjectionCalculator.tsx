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
import BurnMetricsConcise from './BurnMetricsConcise';

interface TabPanelProps {
  children?: React.ReactNode;
  index?: any;
  value?: any;
}

// Main Component
const StartupProjectionCalculator: React.FC = () => {
  // Input state - initial default values
  const defaultInputs: Inputs = {
    initialClients: 100,
    monthlyRevenuePerClient: 2000,
    cac: 10000,
    churnRate: 5.5, // Annualized percentage
    salesCycleLengthMonths: 3,
    netMarginPercentage: 30,
    marketingReinvestmentPercentage: 50,
    seedMarketingBudget: 2000000,
    seedMarketingMonths: 6,
    scenarioName: "Default Scenario",
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

  // Format number with commas
  const formatNumberWithCommas = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Remove commas and convert to number
  const parseFormattedNumber = (value: string): number => {
    return parseFloat(value.replace(/,/g, ''));
  };

  // Get formatted value for display
  const getFormattedValue = (name: string): string => {
    if (name === 'scenarioName') return inputs.scenarioName;
    
    const value = inputs[name as keyof Inputs];
    if (typeof value === 'number') {
      return formatNumberWithCommas(value);
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

  return (
    <>
      <Calculator
        inputs={inputs}
        setProjectionData={setProjectionData}
        setSummaryMetrics={setSummaryMetrics}
      />
      <Card className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto rounded-xl shadow-xl border border-slate-100 bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            5-Year Startup Projection Calculator
          </CardTitle>
          <p className="text-slate-500 text-center max-w-2xl mx-auto">
            Adjust parameters, save scenarios, and visualize your startup's financial trajectory
          </p>
        </CardHeader>
        <CardContent>
          {/* Scenario Management */}
          <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-between items-center">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  name="scenarioName"
                  value={inputs.scenarioName}
                  onChange={handleInputChange}
                  placeholder="Scenario Name"
                  className="p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <button
                  onClick={saveScenario}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium flex items-center text-sm sm:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                  </svg>
                  Save Scenario
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
                <button
                  onClick={() => setShowSavedScenarios(!showSavedScenarios)}
                  className="bg-slate-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium flex items-center text-sm sm:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  {showSavedScenarios ? 'Hide Saved' : 'Show Saved'} ({Object.keys(savedScenarios).length})
                </button>

                <button
                  onClick={resetToDefaults}
                  className="bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium flex items-center text-sm sm:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Reset
                </button>

                {/* Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowLinkOptions(!showLinkOptions)}
                    className="bg-emerald-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium flex items-center text-sm sm:text-base"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    Share <span className="ml-1">&#9662;</span>
                  </button>
                  {showLinkOptions && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-xl z-10">
                      <button
                        onClick={async () => {
                          const link = await getShareableLink(true);
                          navigator.clipboard.writeText(link);
                          alert('Shortened link copied to clipboard!');
                          setShowLinkOptions(false);
                        }}
                        className="block w-full text-left px-4 py-3 hover:bg-slate-50 rounded-t-lg font-medium text-slate-700 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                          <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                        </svg>
                        Copy Shortened Link
                      </button>
                      <button
                        onClick={async () => {
                          const link = await getShareableLink(false);
                          navigator.clipboard.writeText(link);
                          alert('Original link copied to clipboard!');
                          setShowLinkOptions(false);
                        }}
                        className="block w-full text-left px-4 py-3 hover:bg-slate-50 rounded-b-lg font-medium text-slate-700 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                        Copy Original Link
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Saved Scenarios Dropdown */}
          {showSavedScenarios && (
            <div className="mb-8 p-6 border rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-slate-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                Saved Scenarios
              </h3>
              {Object.keys(savedScenarios).length === 0 ? (
                <div className="p-4 bg-white rounded-lg text-slate-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  No saved scenarios yet. Save one using the form above.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.keys(savedScenarios).map((name) => (
                    <div
                      key={name}
                      onClick={() => loadScenario(name)}
                      className="p-4 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 flex justify-between items-center shadow-sm hover:shadow"
                    >
                      <span className="font-medium text-slate-700">{name}</span>
                      <button
                        onClick={(e) => deleteScenario(name, e)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-colors"
                        title="Delete Scenario"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <Tabs>
            <TabList>
              <Tab>Projection Summary</Tab>
              <Tab>Charts</Tab>
              <Tab>Burn</Tab>
            </TabList>

            <TabPanel>
              {/* Input Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="p-4 sm:p-6 rounded-xl border border-slate-100 shadow-sm bg-gradient-to-br from-blue-50 to-slate-50">
                  <h2 className="text-xl font-bold mb-5 text-slate-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    Business Inputs
                  </h2>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700">Initial Clients</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="initialClients"
                          value={getFormattedValue('initialClients')}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700">Monthly Revenue/Client</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                          <span>$</span>
                        </div>
                        <input
                          type="text"
                          name="monthlyRevenuePerClient"
                          value={getFormattedValue('monthlyRevenuePerClient')}
                          onChange={handleInputChange}
                          className="w-full p-3 pl-8 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700">Customer Acquisition Cost</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                          <span>$</span>
                        </div>
                        <input
                          type="text"
                          name="cac"
                          value={getFormattedValue('cac')}
                          onChange={handleInputChange}
                          className="w-full p-3 pl-8 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700">Annual Churn Rate</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="churnRate"
                          value={getFormattedValue('churnRate')}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                          <span>%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700">Fixed Costs</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                          <span>$</span>
                        </div>
                        <input
                          type="text"
                          name="fixedCosts"
                          value={getFormattedValue('fixedCosts')}
                          onChange={handleInputChange}
                          className="w-full p-3 pl-8 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700">Initial Cash</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                          <span>$</span>
                        </div>
                        <input
                          type="text"
                          name="initialCash"
                          value={getFormattedValue('initialCash')}
                          onChange={handleInputChange}
                          className="w-full p-3 pl-8 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 rounded-xl border border-slate-100 shadow-sm bg-gradient-to-br from-indigo-50 to-slate-50">
                  <h2 className="text-xl font-bold mb-5 text-slate-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Financial Inputs
                  </h2>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700">Sales Cycle</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="salesCycleLengthMonths"
                          value={getFormattedValue('salesCycleLengthMonths')}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                          <span>months</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700">Net Margin</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="netMarginPercentage"
                          value={getFormattedValue('netMarginPercentage')}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                          <span>%</span>
                        </div>
                      </div>
                    </div>

                    {/* Investment metrics removed from here as they are shown in the projection summary */}

                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700">Marketing Reinvestment</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="marketingReinvestmentPercentage"
                          value={getFormattedValue('marketingReinvestmentPercentage')}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                          <span>%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700">Seed Marketing Budget</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                          <span>$</span>
                        </div>
                        <input
                          type="text"
                          name="seedMarketingBudget"
                          value={getFormattedValue('seedMarketingBudget')}
                          onChange={handleInputChange}
                          className="w-full p-3 pl-8 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700">Seed Period</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="seedMarketingMonths"
                          value={getFormattedValue('seedMarketingMonths')}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                          <span>months</span>
                        </div>
                      </div>
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
            <TabPanel>
              <BurnMetricsConcise data={projectionData} />
            </TabPanel>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}

export default StartupProjectionCalculator;
