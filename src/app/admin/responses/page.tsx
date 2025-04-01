'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSurvey } from '../../../../src/contexts/SurveyContext';

type SurveyLayoutProps = {
  children: React.ReactNode;
};

export default function SurveyLayout({ children }: SurveyLayoutProps) {
  const pathname = usePathname();
  const { progress } = useSurvey();
  
  const steps = [
    { name: 'Language', path: '/survey/language' },
    { name: 'Age', path: '/survey/age' },
    { name: 'Additional', path: '/survey/additional' },
    { name: 'Summary', path: '/survey/summary' },
    { name: 'Payment', path: '/survey/payment' },
    { name: 'Thank You', path: '/survey/thank-you' },
  ];
  
  // Find the current step index
  const currentStepIndex = steps.findIndex(step => step.path === pathname);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex flex-col">
      {/* Header with logo */}
      <header className="px-6 py-4 border-b border-indigo-500/20 backdrop-blur-sm bg-black/20 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Survey Pro</span>
              </h1>
              <p className="text-gray-400 text-xs">Developer Preferences Survey</p>
            </div>
          </Link>
          
          {/* Help button with futuristic design */}
          <button className="px-4 py-2 bg-indigo-600/10 text-indigo-400 rounded-lg text-sm hover:bg-indigo-600/20 transition-colors border border-indigo-500/20 shadow-sm shadow-indigo-500/10 backdrop-blur-sm relative overflow-hidden group">
            <span className="absolute inset-0 w-1/2 bg-gradient-to-r from-indigo-500/10 to-transparent transform -skew-x-12 group-hover:animate-pulse"></span>
            <span className="relative">Need Help?</span>
          </button>
        </div>
      </header>
      
      {/* Progress bar with enhanced design */}
      <div className="px-6 py-6 bg-black/30 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-medium flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V5z" clipRule="evenodd" />
              </svg>
              <span>Your Progress</span>
            </span>
            <span className="text-indigo-400 font-medium bg-indigo-950/50 px-3 py-1 rounded-full text-sm border border-indigo-500/20">
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-size-200 animate-gradient-x transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Enhanced steps indicator with glowing effect for current step */}
          <div className="mt-6 flex items-center justify-between relative">
            {/* Progress line behind the steps */}
            <div className="absolute h-0.5 bg-gray-700 top-4 left-4 right-4 z-0"></div>
            
            {steps.map((step, index) => (
              <div key={step.name} className="flex flex-col items-center z-10">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index < currentStepIndex 
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30' 
                      : index === currentStepIndex
                        ? 'bg-black border-2 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/50 animate-pulse-light'
                        : 'bg-gray-800 text-gray-500 border border-gray-700'
                  }`}
                >
                  {index < currentStepIndex ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  index === currentStepIndex ? 'text-indigo-400' : index < currentStepIndex ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content area - this was missing in the original */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-indigo-500/10 rounded-xl shadow-xl shadow-indigo-500/5 p-6">
            {children}
          </div>
        </div>
      </main>
      
      {/* Footer - adding this to complete the layout */}
      <footer className="px-6 py-4 border-t border-white/5 bg-black/20">
        <div className="max-w-5xl mx-auto text-center text-gray-500 text-xs">
          <p>© 2025 Survey Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}