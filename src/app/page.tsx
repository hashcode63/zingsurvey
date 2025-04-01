import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white bg-opacity-20 p-6 backdrop-blur-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        
        <h1 className="text-5xl font-bold text-blue-600">FutureSurvey</h1>
        <p className="mt-4 max-w-md text-xl text-black text-opacity-80">
          Discover your programming journey with our innovative survey platform
        </p>
        
        <div className="mt-12 space-y-4 sm:space-x-6 sm:space-y-0">
          <Link href="/survey">
            <div className="inline-block transform rounded-full bg-white bg-opacity-10 px-8 py-3 text-lg font-semibold text-blue-600 shadow-lg backdrop-blur-lg transition hover:bg-opacity-20 hover:scale-105">
              Take the Survey
            </div>
          </Link>
          
          <Link href="/admin/login">
            <div className="inline-block transform rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:scale-105">
              Admin Login
            </div>
          </Link>
        </div>
        
        <div className="mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="transform rounded-2xl bg-white border border-gray-200 p-6 text-black shadow-lg transition hover:shadow-xl hover:scale-105">
            <div className="mb-4 inline-block rounded-full bg-blue-600 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Discover Your Path</h3>
            <p className="mt-2 text-black text-opacity-80">Find out which programming language aligns with your interests and goals.</p>
          </div>
          
          <div className="transform rounded-2xl bg-white border border-gray-200 p-6 text-black shadow-lg transition hover:shadow-xl hover:scale-105">
            <div className="mb-4 inline-block rounded-full bg-pink-600 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Age-Based Insights</h3>
            <p className="mt-2 text-black text-opacity-80">Get personalized recommendations based on your age group and experience level.</p>
          </div>
          
          <div className="transform rounded-2xl bg-white border border-gray-200 p-6 text-black shadow-lg transition hover:shadow-xl hover:scale-105">
            <div className="mb-4 inline-block rounded-full bg-blue-600 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Secure Payments</h3>
            <p className="mt-2 text-black text-opacity-80">Easy and secure payment processing with customized pricing based on your profile.</p>
          </div>
        </div>
      </main>
      
      <footer className="p-6 text-center text-black text-opacity-60">
        <p>© {new Date().getFullYear()} FutureSurvey. All rights reserved.</p>
      </footer>
    </div>
  );
}