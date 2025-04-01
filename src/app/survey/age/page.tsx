'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSurvey } from '../../../../src/contexts/SurveyContext';
import SurveyLayout from '../../../../src/components/layouts/SurveyLayout';

export default function AgePage() {
  const router = useRouter();
  const { surveyData, updateSurveyData } = useSurvey();
  const [selectedAge, setSelectedAge] = useState(surveyData.age || '');
  const [error, setError] = useState('');

  // Set appropriate amount when age changes
  useEffect(() => {
    if (selectedAge) {
      const amount = selectedAge === 'under18' ? 3000 : 5000;
      updateSurveyData({ amount }); // Only update the amount when selectedAge changes
    }
  }, [selectedAge]); // Add selectedAge as the dependency

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAge) {
      setError('Please select your age group');
      return;
    }

    updateSurveyData({ age: selectedAge });
    router.push('/survey/additional');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Age Group
        </h1>
        <div className="rounded-full bg-blue-800 bg-opacity-20 px-4 py-2 text-blue-300">
          Step 2 of 4
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="mb-6 text-xl font-medium text-blue-300">
            Please select your age group:
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Card for Under 18 */}
            <div
              onClick={() => {
                setSelectedAge('under18');
                setError('');
              }}
              className={`relative cursor-pointer overflow-hidden rounded-xl p-6 transition-all duration-300 ${
                selectedAge === 'under18'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg transform scale-105'
                  : 'bg-blue-800 bg-opacity-20 hover:bg-opacity-40'
              }`}
            >
              <div className="relative z-10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 bg-opacity-20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-200">Under 18</h3>
                <p className="mt-2 text-blue-400">
                  Young developer exploring the world of programming
                </p>
                <div className="mt-4 rounded-full bg-blue-500 bg-opacity-20 px-4 py-2 inline-block text-blue-300">
                  ₦3,000
                </div>
              </div>
            </div>

            {/* Card for 18 or Above */}
            <div
              onClick={() => {
                setSelectedAge('over18');
                setError('');
              }}
              className={`relative cursor-pointer overflow-hidden rounded-xl p-6 transition-all duration-300 ${
                selectedAge === 'over18'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg transform scale-105'
                  : 'bg-blue-800 bg-opacity-20 hover:bg-opacity-40'
              }`}
            >
              <div className="relative z-10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500 bg-opacity-20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-200">18 or Above</h3>
                <p className="mt-2 text-blue-400">
                  Adult developer enhancing programming skills
                </p>
                <div className="mt-4 rounded-full bg-purple-500 bg-opacity-20 px-4 py-2 inline-block text-blue-300">
                  ₦5,000
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-500 bg-opacity-20 p-3 text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => router.push('/survey/language')}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-blue-500 p-4 px-6 py-3 font-medium text-blue-300 transition-all duration-300 hover:border-blue-300"
          >
            <span className="relative z-10">Back</span>
          </button>

          <button
            type="submit"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-purple-500 p-4 px-6 py-3 font-medium text-blue-300 transition-all duration-300 hover:border-purple-300"
          >
            <span className="relative z-10">Continue</span>
            <span className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200 group-hover:translate-y-full"></span>
          </button>
        </div>
      </form>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return <SurveyLayout>{children}</SurveyLayout>;
}