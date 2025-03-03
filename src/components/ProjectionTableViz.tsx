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
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">5-Year Projection Summary</h2>

      {/* Key metrics summary card */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-wrap justify-around">
        <div className="text-center px-4 py-2">
          <div className="text-xs text-gray-500 uppercase">Customer LTV</div>
          <div className="text-xl font-bold text-gray-800">${firstYearData.customerLTV.toLocaleString()}</div>
        </div>
        <div className="text-center px-4 py-2">
          <div className="text-xs text-gray-500 uppercase">LTV:CAC Ratio</div>
          <div className="text-xl font-bold text-blue-600">{firstYearData.ltvToCacRatio.toFixed(1)}x</div>
        </div>
        <div className="text-center px-4 py-2">
          <div className="text-xs text-gray-500 uppercase">CAC Payback</div>
          <div className="text-xl font-bold text-gray-800">{firstYearData.cacPaybackMonths} months</div>
        </div>
        <div className="text-center px-4 py-2">
          <div className="text-xs text-gray-500 uppercase">Y5 Revenue</div>
          <div className="text-xl font-bold text-green-600">{formatCurrency(lastYearData.annualRevenue)}</div>
        </div>
        <div className="text-center px-4 py-2">
          <div className="text-xs text-gray-500 uppercase">Y5 Clients</div>
          <div className="text-xl font-bold text-gray-800">{lastYearData.clients.toLocaleString()}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="py-4 px-2 text-left font-semibold text-gray-700 w-20">Year</th>
              <th className="py-4 px-2 text-left font-semibold text-gray-700">Clients</th>
              <th className="py-4 px-2 text-left font-semibold text-gray-700">Revenue</th>
              <th className="py-4 px-2 text-left font-semibold text-gray-700">Marketing</th>
              <th className="py-4 px-2 text-left font-semibold text-gray-700">Net Profit</th>
            </tr>
          </thead>
          <tbody>
            {projectionData.map((yearData) => (
              <tr key={yearData.year} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {yearData.year}
                    </div>
                  </div>
                </td>

                <td className="py-4 px-2">
                  <div>
                    <div className="font-semibold text-lg">{yearData.clients.toLocaleString()}</div>
                  </div>
                </td>

                <td className="py-4 px-2">
                  <div>
                    <div className="font-semibold text-lg">{formatCurrency(yearData.annualRevenue)}</div>
                  </div>
                </td>

                <td className="py-4 px-2">
                  <div className="font-semibold text-lg">{formatCurrency(yearData.annualMarketingSpend)}</div>
                  <div className="text-xs">
                    {(yearData.annualMarketingSpend / yearData.annualRevenue * 100).toFixed(0)}% of revenue
                  </div>
                </td>

                <td className="py-4 px-2">
                  <div className={`font-semibold text-lg ${yearData.annualNetProfit < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(yearData.annualNetProfit)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Additional insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-2">Growth Summary</h3>
          <p className="text-gray-700">
            Client base grows <span className="font-semibold text-blue-700">
              {(lastYearData.clients / firstYearData.clients).toFixed(0)}x
            </span> over 5 years, from {firstYearData.clients} to {lastYearData.clients}.
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-2">Revenue Insights</h3>
          <p className="text-gray-700">
            Revenue grows from {formatCurrency(firstYearData.annualRevenue)} to {formatCurrency(lastYearData.annualRevenue)} with consistent 60% margins.
          </p>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-2">Investment Metrics</h3>
          <p className="text-gray-700">
            LTV:CAC ratio of {firstYearData.ltvToCacRatio.toFixed(1)}x with {firstYearData.cacPaybackMonths}-month payback period validates the aggressive reinvestment strategy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectionTableViz;
