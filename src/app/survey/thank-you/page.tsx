'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSurvey } from '../../../../src/contexts/SurveyContext';
import SurveyLayout from '../../../../src/components/layouts/SurveyLayout';

export default function ThankYouPage() {
  const router = useRouter();
  const { surveyData, resetSurvey } = useSurvey();
  
  // If there's no payment info, redirect to the beginning
  useEffect(() => {
    if (!surveyData.paymentInfo?.status) {
      router.push('/survey');
    }
  }, [surveyData, router]);
  
  // Reset the survey data after 1 minute
  useEffect(() => {
    const timer = setTimeout(() => {
      resetSurvey();
    }, 60000);
    
    return () => clearTimeout(timer);
  }, [resetSurvey]);

  return (
    <SurveyLayout>
      <div className="flex h-full flex-col items-center justify-center py-12 text-center relative">
        {/* Background abstract elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-72 h-72 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute h-2 w-2 rounded-full bg-white opacity-20 top-1/4 left-1/4 animate-pulse"></div>
          <div className="absolute h-3 w-3 rounded-full bg-white opacity-30 top-1/2 left-1/3 animate-ping"></div>
          <div className="absolute h-2 w-2 rounded-full bg-white opacity-20 bottom-1/4 right-1/4 animate-pulse"></div>
          <div className="absolute h-3 w-3 rounded-full bg-white opacity-30 bottom-1/3 right-1/3 animate-ping"></div>
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          <div className="mb-8 rounded-full bg-indigo-600 bg-opacity-20 p-6 backdrop-blur-lg mx-auto w-32 h-32 flex items-center justify-center border border-indigo-500 border-opacity-30 shadow-lg shadow-indigo-900/20">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-cyan-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          <h1 className="mb-4 text-4xl font-bold text-cyan-300 tracking-tight">Thank You!</h1>
          
          <p className="mb-8 max-w-lg text-xl text-blue-100 mx-auto leading-relaxed">
            Your survey has been submitted successfully. We appreciate your participation and payment.
          </p>
          
          <div className="mb-8 rounded-xl bg-indigo-900 bg-opacity-30 p-8 text-left backdrop-blur-md border border-indigo-500 border-opacity-30 shadow-xl">
            <h2 className="mb-6 text-xl font-semibold text-cyan-200 flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2 text-cyan-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                />
              </svg>
              Payment Receipt
            </h2>
            
            <dl className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-lg hover:bg-white hover:bg-opacity-5 transition-all">
                <dt className="font-medium text-violet-200">Amount Paid:</dt>
                <dd className="text-cyan-100 font-semibold">
                  {new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN'
                  }).format(surveyData.paymentInfo?.amount || 0)}
                </dd>
              </div>
              
              <div className="grid grid-cols-2 gap-2 p-3 rounded-lg hover:bg-white hover:bg-opacity-5 transition-all">
                <dt className="font-medium text-violet-200">Payment Date:</dt>
                <dd className="text-cyan-100">
                  {surveyData.paymentInfo?.paymentDate 
                    ? new Date(surveyData.paymentInfo.paymentDate).toLocaleString() 
                    : ''}
                </dd>
              </div>
              
              <div className="grid grid-cols-2 gap-2 p-3 rounded-lg hover:bg-white hover:bg-opacity-5 transition-all">
                <dt className="font-medium text-violet-200">Email:</dt>
                <dd className="text-cyan-100">{surveyData.paymentInfo?.email || ''}</dd>
              </div>
              
              <div className="grid grid-cols-2 gap-2 p-3 rounded-lg hover:bg-white hover:bg-opacity-5 transition-all">
                <dt className="font-medium text-violet-200">Status:</dt>
                <dd className="text-cyan-400 font-semibold flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
                  Completed
                </dd>
              </div>
            </dl>
          </div>
          
          <button 
            onClick={() => {
              resetSurvey();
              router.push('/');
            }}
            className="group relative mt-4 inline-flex items-center overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 px-8 py-3 text-cyan-100 shadow-lg transition-all hover:from-indigo-700 hover:to-cyan-700 border border-cyan-400 border-opacity-30"
          >
            <span className="absolute inset-0 bg-white bg-opacity-10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
            <span className="relative">Return to Home</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </button>
        </div>
      </div>
    </SurveyLayout>
  );
}