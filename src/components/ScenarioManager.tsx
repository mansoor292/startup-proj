'use client';

import React from 'react';
import Inputs from '../types/Inputs';

interface ScenarioManagerProps {
  inputs: Inputs;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveScenario: () => void;
  resetToDefaults: () => void;
  setShowSavedScenarios: (show: boolean) => void;
  showSavedScenarios: boolean;
  savedScenarios: {[key: string]: Inputs};
  setShowLinkOptions: (show: boolean) => void;
  showLinkOptions: boolean;
  getShareableLink: (shorten: boolean) => Promise<string>;
}

const ScenarioManager: React.FC<ScenarioManagerProps> = ({
  inputs,
  handleInputChange,
  saveScenario,
  resetToDefaults,
  setShowSavedScenarios,
  showSavedScenarios,
  savedScenarios,
  setShowLinkOptions,
  showLinkOptions,
  getShareableLink
}) => {
  return (
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
  );
};

export default ScenarioManager;
