'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSurvey } from '../../../../src/contexts/SurveyContext';
import SurveyLayout from '../../../../src/components/layouts/SurveyLayout';

export default function SummaryPage() {
  const router = useRouter();
  const { surveyData } = useSurvey();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getLanguageName = (languageId: string) => {
    const languageMap: Record<string, string> = {
      javascript: 'JavaScript',
      python: 'Python',
      java: 'Java',
      csharp: 'C#',
      cpp: 'C++',
      ruby: 'Ruby',
      php: 'PHP',
      go: 'Go',
      rust: 'Rust',
    };

    return languageMap[languageId] || languageId;
  };

  const getExperienceLabel = (experienceId: string) => {
    const experienceMap: Record<string, string> = {
      beginner: 'Beginner (less than 1 year)',
      intermediate: 'Intermediate (1-3 years)',
      experienced: 'Experienced (3-5 years)',
      advanced: 'Advanced (5+ years)',
    };

    return experienceMap[experienceId] || experienceId;
  };

  const getAgeLabel = (ageId: string) => {
    return ageId === 'under18' ? 'Under 18' : '18 or Above';
  };

  return (
    <SurveyLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Survey Summary
        </h1>
        <div className="rounded-full bg-blue-800 bg-opacity-20 px-4 py-2 text-blue-300">
          Step 4 of 5
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl bg-gradient-to-br from-blue-800 to-purple-800 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-blue-300">Your Information</h2>

          <dl className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3">
              <dt className="font-medium text-blue-400">Programming Language:</dt>
              <dd className="col-span-2 text-blue-200">{getLanguageName(surveyData.language)}</dd>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3">
              <dt className="font-medium text-blue-400">Age Group:</dt>
              <dd className="col-span-2 text-blue-200">{getAgeLabel(surveyData.age)}</dd>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3">
              <dt className="font-medium text-blue-400">Experience Level:</dt>
              <dd className="col-span-2 text-blue-200">
                {surveyData.additionalResponses?.experience
                  ? getExperienceLabel(surveyData.additionalResponses.experience)
                  : 'Not specified'}
              </dd>
            </div>

            {surveyData.additionalResponses?.framework && (
              <div className="grid grid-cols-1 sm:grid-cols-3">
                <dt className="font-medium text-blue-400">Preferred Framework:</dt>
                <dd className="col-span-2 text-blue-200">{surveyData.additionalResponses.framework}</dd>
              </div>
            )}

            {surveyData.additionalResponses?.learningStyle && (
              <div className="grid grid-cols-1 sm:grid-cols-3">
                <dt className="font-medium text-blue-400">Learning Style:</dt>
                <dd className="col-span-2 text-blue-200">{surveyData.additionalResponses.learningStyle}</dd>
              </div>
            )}

            {surveyData.additionalResponses?.careerGoal && (
              <div className="grid grid-cols-1 sm:grid-cols-3">
                <dt className="font-medium text-blue-400">Career Goal:</dt>
                <dd className="col-span-2 text-blue-200">{surveyData.additionalResponses.careerGoal}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-teal-800 to-blue-800 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-blue-300">Payment Details</h2>
          <p className="text-lg text-blue-200">
            Based on your age, your survey fee is:{' '}
            <span className="font-bold text-teal-400">
              {formatAmount(surveyData.age === 'under18' ? 3000 : 5000)}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-10 flex justify-between">
        <button
          onClick={() => router.push('/survey/additional')}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-blue-500 p-4 px-6 py-3 font-medium text-blue-300 transition-all duration-300 hover:border-blue-300"
        >
          <span className="relative z-10">Back</span>
        </button>

        <button
          onClick={() => router.push('/survey/payment')}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-purple-500 p-4 px-6 py-3 font-medium text-blue-300 transition-all duration-300 hover:border-purple-300"
        >
          <span className="relative z-10">Proceed to Payment</span>
          <span className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200 group-hover:translate-y-full"></span>
        </button>
      </div>
    </SurveyLayout>
  );
}