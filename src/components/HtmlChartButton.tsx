'use client';

import React, { useState } from 'react';
import HtmlChartModal from './HtmlChartModal';
import { generateHtmlChart } from '../utils/htmlChartUtils';
import Inputs from '../types/Inputs';

interface HtmlChartButtonProps {
  inputs: Inputs;
}

const HtmlChartButton: React.FC<HtmlChartButtonProps> = ({ inputs }) => {
  const [showModal, setShowModal] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const html = await generateHtmlChart(inputs);
      setGeneratedHtml(html);
      setShowModal(true);
    } catch (error) {
      console.error('Error generating HTML chart:', error);
      alert('Failed to generate HTML chart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium flex items-center text-sm sm:text-base"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        {isLoading ? 'Loading...' : 'Get HTML Charts'}
      </button>
      
      {showModal && (
        <HtmlChartModal
          html={generatedHtml}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default HtmlChartButton;
