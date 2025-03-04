import MonthlyData from '../types/MonthlyData';
import React from 'react';
import YearlyData from '../types/YearlyData';

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  } else if (value < 0 && Math.abs(value) >= 1000) {
    return `-${(Math.abs(value) / 1000).toFixed(0)}K`;
  } else {
    return `${value.toFixed(0)}`;
  }
};

interface ProjectionTableVizProps {
  projectionData: YearlyData[];
}

const ProjectionTableViz: React.FC<ProjectionTableVizProps> = ({ projectionData }) => {
  // Calculate key metrics from the first year's data
  const firstYearData = projectionData[0];
  const lastYearData = projectionData[projectionData.length - 1];

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-xl border border-slate-100">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">5-Year Projection Summary</h2>

      {/* Key metrics summary card */}
      <div className="mb-6 p-3 sm:p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-100 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-xs font-medium text-slate-500 uppercase mb-1">Customer LTV</div>
            <div className="text-xl font-bold text-slate-800">${firstYearData.customerLTV.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-xs font-medium text-slate-500 uppercase mb-1">LTV:CAC Ratio</div>
            <div className="text-xl font-bold text-blue-600">{firstYearData.ltvToCacRatio.toFixed(1)}x</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-xs font-medium text-slate-500 uppercase mb-1">CAC Payback</div>
            <div className="text-xl font-bold text-indigo-600">{firstYearData.cacPaybackMonths} months</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-xs font-medium text-slate-500 uppercase mb-1">Y5 Revenue</div>
            <div className="text-xl font-bold text-emerald-600">{formatCurrency(lastYearData.annualRevenue)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-xs font-medium text-slate-500 uppercase mb-1">Y5 Clients</div>
            <div className="text-xl font-bold text-amber-600">{lastYearData.clients.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mb-6 -mx-4 sm:mx-0">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200">
              <th className="py-4 px-4 text-left font-semibold text-slate-700 w-20">Year</th>
              <th className="py-4 px-4 text-left font-semibold text-slate-700">Clients</th>
              <th className="py-4 px-4 text-left font-semibold text-slate-700">Revenue</th>
              <th className="py-4 px-4 text-left font-semibold text-slate-700">Marketing</th>
              <th className="py-4 px-4 text-left font-semibold text-slate-700">Net Profit</th>
              <th className="py-4 px-4 text-left font-semibold text-slate-700">Cash</th>
            </tr>
          </thead>
          <tbody>
            {projectionData.map((yearData) => (
              <tr key={yearData.year} className="border-b border-slate-100 hover:bg-blue-50 transition-colors">
                <td className="py-5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
                      {yearData.year}
                    </div>
                  </div>
                </td>

                <td className="py-5 px-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <div className="font-semibold text-lg">{yearData.clients.toLocaleString()}</div>
                  </div>
                </td>

                <td className="py-5 px-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    <div className="font-semibold text-lg">{formatCurrency(yearData.annualRevenue)}</div>
                  </div>
                </td>

                <td className="py-5 px-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-semibold text-lg">{formatCurrency(yearData.annualMarketingSpend)}</div>
                      <div className="text-xs text-slate-500">
                        {(yearData.annualMarketingSpend / yearData.annualRevenue * 100).toFixed(0)}% of revenue
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-5 px-4">
                  <div className="flex items-center">
                    {yearData.annualNetProfit < 0 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                    )}
                    <div className={`font-semibold text-lg ${yearData.annualNetProfit < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(yearData.annualNetProfit)}
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div className="font-semibold text-lg">{formatCurrency(yearData.cash)}</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Additional insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-bold text-slate-800">Growth Summary</h3>
          </div>
          <p className="text-slate-700">
            Client base grows <span className="font-semibold text-blue-700">
              {(lastYearData.clients / firstYearData.clients).toFixed(0)}x
            </span> over 5 years, from {firstYearData.clients.toLocaleString()} to {lastYearData.clients.toLocaleString()}.
          </p>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-50 to-slate-50 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-bold text-slate-800">Revenue Insights</h3>
          </div>
          <p className="text-slate-700">
            Revenue grows from <span className="font-semibold text-green-600">{formatCurrency(firstYearData.annualRevenue)}</span> to <span className="font-semibold text-green-600">{formatCurrency(lastYearData.annualRevenue)}</span> with consistent 60% margins.
          </p>
        </div>

        <div className="p-4 bg-gradient-to-br from-amber-50 to-slate-50 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-bold text-slate-800">Investment Metrics</h3>
          </div>
          <p className="text-slate-700">
            LTV:CAC ratio of <span className="font-semibold text-blue-600">{firstYearData.ltvToCacRatio.toFixed(1)}x</span> with <span className="font-semibold text-indigo-600">{firstYearData.cacPaybackMonths}-month</span> payback period validates the aggressive reinvestment strategy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectionTableViz;
