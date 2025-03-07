'use client';

import React from 'react';

interface HtmlChartModalProps {
  html: string;
  onClose: () => void;
}

const HtmlChartModal: React.FC<HtmlChartModalProps> = ({ html, onClose }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(html);
    alert('HTML code copied to clipboard!');
  };

  const downloadHtml = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'startup-projection-chart.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">HTML Chart Code</h2>
        <p className="mb-4 text-gray-600">
          Copy this code and paste it into your website to embed the chart with your current scenario settings.
        </p>
        
        <textarea
          className="w-full h-64 p-2 border border-gray-300 rounded-md font-mono text-sm"
          value={html}
          readOnly
        />
        
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={copyToClipboard}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Copy to Clipboard
          </button>
          <button
            onClick={downloadHtml}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Download HTML
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HtmlChartModal;
