'use client';

/**
 * Format number with commas for display, preserving decimal places
 */
export const formatNumberWithCommas = (num: number): string => {
  // Split the number into integer and decimal parts
  const parts = num.toString().split('.');
  // Add commas to the integer part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Join the parts back together with a decimal point if there's a decimal part
  return parts.join('.');
};

/**
 * Remove commas and convert to number, preserving decimal places
 */
export const parseFormattedNumber = (value: string): number => {
  return parseFloat(value.replace(/,/g, ''));
};

/**
 * Get shareable link for the scenario
 */
export const getShareableLink = async (scenarioStr: string, shorten: boolean = true): Promise<string> => {
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

/**
 * Convert projection data to CSV format for download
 */
export const convertToCSV = (data: any[]): string => {
  if (!data || data.length === 0) {
    return "";
  }

  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item => Object.values(item).join(','));
  return `${headers}\n${rows.join('\n')}`;
};

/**
 * Function to trigger the CSV download
 */
export const downloadCSV = (projectionData: any[]): void => {
  const csvData = convertToCSV(projectionData);
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'projection_data.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
