'use client';

import React from 'react';
import SurveyLayout from '../../../src/components/layouts/SurveyLayout';
import Link from 'next/link';

export default function SurveyEntry() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-8 text-center">
      <h1 className="mb-6 text-4xl font-extrabold text-blue-500 drop-shadow-lg">
        Welcome to Our Programming Survey
      </h1>

      <div className="space-y-8 text-blue-200">
        <p className="text-lg">
          This survey will help us understand your programming preferences and provide you with valuable insights.
        </p>

        {/* Card 1 */}
        <div className="rounded-xl bg-gradient-to-r from-blue-800 to-purple-800 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
          <h2 className="mb-4 text-2xl font-semibold text-blue-400">What to expect:</h2>
          <ul className="ml-6 space-y-2 list-disc text-blue-200">
            <li>Questions about your preferred programming language</li>
            <li>Your age group (below or above 18)</li>
            <li>Additional questions about your programming experience</li>
            <li>A small payment based on your age group</li>
          </ul>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-800 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
          <h2 className="mb-4 text-2xl font-semibold text-blue-400">Why take this survey?</h2>
          <p className="text-blue-200">
            Your responses will help us improve our programming resources and tailor content to better suit different age groups and experience levels. Plus, you'll receive personalized insights based on your responses!
          </p>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl bg-gradient-to-r from-blue-800 to-teal-800 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
          <h2 className="mb-4 text-2xl font-semibold text-blue-400">Pricing:</h2>
          <ul className="ml-6 space-y-2 list-disc text-blue-200">
            <li>
              <span className="font-medium text-blue-300">Below 18:</span> 3,000 NGN
            </li>
            <li>
              <span className="font-medium text-blue-300">18 and above:</span> 5,000 NGN
            </li>
          </ul>
          <p className="mt-4 text-sm italic text-blue-300">
            Payment is processed securely at the end of the survey.
          </p>
        </div>
      </div>

      {/* Start Survey Button */}
      <div className="mt-12 flex justify-center">
        <Link href="/survey/language">
          <div className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-blue-500 p-4 px-6 py-3 font-medium text-blue-500 transition-all duration-300 hover:border-blue-300">
            <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 transition-all duration-300 group-hover:opacity-50"></span>
            <span className="relative z-10">Start Survey</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return <SurveyLayout>{children}</SurveyLayout>;
}