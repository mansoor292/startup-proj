'use server';

import { calculateProjections } from '../../utils/projectionCalculator';

// Server function to calculate projections from a base64 encoded scenario
export async function getProjectionsFromEncodedScenario(encodedScenario: string) {
  if (!encodedScenario) {
    throw new Error('Missing scenario parameter');
  }
  
  try {
    // Decode and parse the scenario parameter
    const decodedScenario = JSON.parse(atob(encodedScenario));
    
    // Check if the decoded scenario has the required fields
    if (!decodedScenario.initialClients || 
        !decodedScenario.monthlyRevenuePerClient || 
        !decodedScenario.grossMarginPercentage) {
      throw new Error('Invalid scenario: missing required fields');
    }
    
    // Calculate projections based on the scenario
    return calculateProjections(decodedScenario);
    
  } catch (error) {
    throw new Error('Invalid scenario format');
  }
}
