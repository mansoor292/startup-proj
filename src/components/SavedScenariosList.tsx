'use client';

import React from 'react';
import Inputs from '../types/Inputs';

interface SavedScenariosListProps {
  showSavedScenarios: boolean;
  savedScenarios: {[key: string]: Inputs};
  loadScenario: (scenarioName: string) => void;
  deleteScenario: (scenarioName: string, e: React.MouseEvent) => void;
}

const SavedScenariosList: React.FC<SavedScenariosListProps> = ({
  showSavedScenarios,
  savedScenarios,
  loadScenario,
  deleteScenario
}) => {
  if (!showSavedScenarios) {
    return null;
  }

  return (
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
  );
};

export default SavedScenariosList;
