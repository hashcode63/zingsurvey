import React from 'react';
import { SurveyProvider } from '../../contexts/SurveyContext';
import Link from 'next/link';

interface SurveyLayoutProps {
  children: React.ReactNode;
}

const SurveyLayout: React.FC<SurveyLayoutProps> = ({ children }) => {
  return (
    <SurveyProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8 flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white bg-opacity-20 p-2">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <span className="text-xl font-bold text-white">FutureSurvey</span>
              </div>
            </Link>
          </header>

          <main className="rounded-2xl backdrop-blur-lg bg-white bg-opacity-10 p-6 shadow-2xl">
            <div className="max-w-3xl mx-auto">
              {children}
            </div>
          </main>

          <footer className="mt-8 text-center text-sm text-white text-opacity-70">
            <p>© {new Date().getFullYear()} FutureSurvey. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </SurveyProvider>
  );
};

export default SurveyLayout;