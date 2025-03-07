'use client';

import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MonthlyData from '../types/MonthlyData';
import YearlyData from '../types/YearlyData';
import ProjectionTableViz from './ProjectionTableViz';
import ProjectionCharts from './ProjectionCharts';
import BurnMetricsConcise from './BurnMetricsConcise';

interface ProjectionTabsProps {
  projectionData: MonthlyData[];
  summaryMetrics: YearlyData[];
  periodType: string;
  colors: {
    revenue: {
      main: string;
      light: string;
      gradient: string[];
    };
    profit: {
      main: string;
      light: string;
      gradient: string[];
    };
    clients: {
      main: string;
      light: string;
      gradient: string[];
    };
    marketing: {
      main: string;
      light: string;
      gradient: string[];
    };
  };
  downloadCSV: () => void;
  children?: React.ReactNode;
}

const ProjectionTabs: React.FC<ProjectionTabsProps> = ({
  projectionData,
  summaryMetrics,
  periodType,
  colors,
  downloadCSV,
  children
}) => {
  return (
    <Tabs>
      <TabList>
        <Tab>Projection Summary</Tab>
        <Tab>Charts</Tab>
        <Tab>Burn</Tab>
      </TabList>

      <TabPanel>
        {/* Inputs Section */}
        {children}
        
        {/* Results Section */}
        <div className="mb-8">
          <button
            onClick={downloadCSV}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Export to CSV
          </button>
          {summaryMetrics.length > 0 && (
            <ProjectionTableViz projectionData={summaryMetrics} />
          )}
        </div>
      </TabPanel>
      <TabPanel>
        {/* Charts Section */}
        <ProjectionCharts
          projectionData={projectionData}
          periodType={periodType}
          colors={colors}
        />
      </TabPanel>
      <TabPanel>
        <BurnMetricsConcise data={projectionData} />
      </TabPanel>
    </Tabs>
  );
};

export default ProjectionTabs;
