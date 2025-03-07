'use client';

import Inputs from '../types/Inputs';

/**
 * Fetches the api-showcase.html template and replaces the API URL with the current scenario
 */
export async function generateHtmlChart(inputs: Inputs): Promise<string> {
  try {
    // Fetch the api-showcase.html template
    const response = await fetch('/api-showcase.html');
    if (!response.ok) {
      throw new Error(`Failed to fetch template: ${response.status}`);
    }
    
    let html = await response.text();
    
    // Encode the current scenario
    const encodedScenario = btoa(JSON.stringify(inputs));
    
    // Get the current origin
    const origin = window.location.origin;
    
    // Replace the API_BASE_URL and ENCODED_SCENARIO in the template
    // Use a more robust approach with regex to ensure we're replacing the right values
    html = html.replace(
      /const API_BASE_URL = "\/api";/g,
      `const API_BASE_URL = "${origin}/api";`
    );
    
    html = html.replace(
      /const ENCODED_SCENARIO = "";/g,
      `const ENCODED_SCENARIO = "${encodedScenario}";`
    );
    
    // Log the replacements for debugging
    console.log('Origin:', origin);
    console.log('Encoded Scenario:', encodedScenario);
    
    // Remove the form elements and update button since they're not needed in the embedded version
    // Find the scenario editor card and remove it
    const scenarioEditorStart = html.indexOf('<div class="bg-white p-6 rounded-lg shadow-lg">');
    const scenarioEditorEnd = html.indexOf('</div>', html.indexOf('</div>', html.indexOf('</div>', scenarioEditorStart) + 1) + 1) + 6;
    
    if (scenarioEditorStart !== -1 && scenarioEditorEnd !== -1) {
      const beforeEditor = html.substring(0, scenarioEditorStart);
      const afterEditor = html.substring(scenarioEditorEnd);
      html = beforeEditor + afterEditor;
    }
    
    // Create a simplified version that directly uses the absolute URL
    const absoluteApiUrl = `${origin}/api?scenario=${encodedScenario}`;
    
    // Replace the entire fetchData function with a new version that only has one fetch call
    const fetchFunctionStart = 'async function fetchData() {';
    const fetchFunctionEnd = '    }'; // This is the closing brace of the fetchData function
    
    // Find the start and end of the fetchData function
    const fetchFunctionStartIndex = html.indexOf(fetchFunctionStart);
    
    if (fetchFunctionStartIndex !== -1) {
      // Find the matching closing brace for the fetchData function
      let braceCount = 1;
      let fetchFunctionEndIndex = fetchFunctionStartIndex + fetchFunctionStart.length;
      
      while (braceCount > 0 && fetchFunctionEndIndex < html.length) {
        if (html[fetchFunctionEndIndex] === '{') {
          braceCount++;
        } else if (html[fetchFunctionEndIndex] === '}') {
          braceCount--;
        }
        fetchFunctionEndIndex++;
      }
      
      if (fetchFunctionEndIndex < html.length) {
        // Replace the entire fetchData function
        const beforeFunction = html.substring(0, fetchFunctionStartIndex);
        const afterFunction = html.substring(fetchFunctionEndIndex);
        
        const newFetchFunction = `async function fetchData() {
            try {
                // Use the pre-configured scenario with absolute URL
                const response = await fetch("${absoluteApiUrl}");
                
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                
                const data = await response.json();
                createChart(data);
                
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to fetch projection data. Please try again.');
            }
        }`;
        
        html = beforeFunction + newFetchFunction + afterFunction;
      }
    }
    
    return html;
  } catch (error) {
    console.error('Error generating HTML chart:', error);
    throw error;
  }
}
