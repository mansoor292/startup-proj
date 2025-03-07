import { NextRequest, NextResponse } from 'next/server';
import { getProjectionsFromEncodedScenario } from './calculator';

// API route handler
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const scenarioParam = searchParams.get('scenario');
    
    if (!scenarioParam) {
      return NextResponse.json(
        { error: 'Missing scenario parameter' },
        { status: 400 }
      );
    }
    
    try {
      // Use the server action to get projections
      const result = await getProjectionsFromEncodedScenario(scenarioParam);
      
      // Return JSON response
      return NextResponse.json(result);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
