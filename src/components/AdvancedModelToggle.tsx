'use client';

import React from 'react';
import Inputs from '../types/Inputs';

interface AdvancedModelToggleProps {
  inputs: Inputs;
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getFormattedValue: (name: string) => string;
}

const AdvancedModelToggle: React.FC<AdvancedModelToggleProps> = ({
  inputs,
  setInputs,
  handleInputChange,
  getFormattedValue
}) => {
  return (
    <div className="p-4 sm:p-6 rounded-xl border border-slate-100 shadow-sm bg-gradient-to-br from-purple-50 to-slate-50 md:col-span-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Advanced Growth Model
        </h2>
        <div className="flex items-center">
          <span className="mr-3 text-sm font-medium text-slate-700">
            {inputs.useSCurveModel ? 'S-Curve Model Enabled' : 'Linear Growth Model'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={inputs.useSCurveModel} 
              onChange={(e) => {
                setInputs(prev => ({
                  ...prev,
                  useSCurveModel: e.target.checked
                }));
              }}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>
      
      {inputs.useSCurveModel && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">Total Addressable Market</label>
            <div className="relative">
              <input
                type="text"
                name="totalAddressableMarket"
                value={getFormattedValue('totalAddressableMarket')}
                onChange={handleInputChange}
                className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Maximum potential customers</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">Early Adopter Ceiling</label>
            <div className="relative">
              <input
                type="text"
                name="earlyAdopterCeiling"
                value={getFormattedValue('earlyAdopterCeiling')}
                onChange={handleInputChange}
                className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">% of TAM representing early adopters (0.16 = 16%)</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">Main Market Resistance</label>
            <div className="relative">
              <input
                type="text"
                name="mainMarketResistance"
                value={getFormattedValue('mainMarketResistance')}
                onChange={handleInputChange}
                className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Difficulty factor when entering main market (1.5 = 50% harder)</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">Competitive Response Threshold</label>
            <div className="relative">
              <input
                type="text"
                name="competitiveResponseThreshold"
                value={getFormattedValue('competitiveResponseThreshold')}
                onChange={handleInputChange}
                className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Customer count that triggers competitor response</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">Competitive Response Impact</label>
            <div className="relative">
              <input
                type="text"
                name="competitiveResponseImpact"
                value={getFormattedValue('competitiveResponseImpact')}
                onChange={handleInputChange}
                className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">How much competitors increase your CAC (1.4 = 40% increase)</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">Channel Saturation Rate</label>
            <div className="relative">
              <input
                type="text"
                name="channelSaturationRate"
                value={getFormattedValue('channelSaturationRate')}
                onChange={handleInputChange}
                className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Rate at which marketing efficiency decreases (0.01 = 1% per month)</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedModelToggle;
