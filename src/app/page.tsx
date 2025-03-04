'use client';

import StartupProjectionCalculator from '../components/StartupProjectionCalculator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Startup Financial Projection Calculator
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Plan your startup's financial future with our advanced projection tool. 
            Visualize growth, track metrics, and make data-driven decisions.
          </p>
        </header>
        <StartupProjectionCalculator />
        <footer className="mt-16 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Startup Projector. All rights reserved.</p>
          <p className="mt-1">Built with modern web technologies for founders and investors.</p>
        </footer>
      </div>
    </div>
  );
}
