'use client';

import React from 'react';
import Inputs from '../types/Inputs';

interface InputFieldsProps {
  inputs: Inputs;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getFormattedValue: (name: string) => string;
}

const InputFields: React.FC<InputFieldsProps> = ({
  inputs,
  handleInputChange,
  getFormattedValue
}) => {
  return (
    <>
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
            <label className="block text-sm font-medium mb-2 text-slate-700">Gross Margin</label>
            <div className="relative">
              <input
                type="text"
                name="grossMarginPercentage"
                value={getFormattedValue('grossMarginPercentage')}
                onChange={handleInputChange}
                className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <span>%</span>
              </div>
            </div>
          </div>

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
    </>
  );
};

export default InputFields;
