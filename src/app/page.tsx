'use client';

import StartupProjectionCalculator from '../components/StartupProjectionCalculator';

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Startup Financial Projection Calculator</h1>
      <StartupProjectionCalculator />
    </div>
  );
}
