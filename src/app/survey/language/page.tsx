'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSurvey } from '../../../../src/contexts/SurveyContext';
import SurveyLayout from '../../../../src/components/layouts/SurveyLayout';

const languages = [
  { id: 'javascript', name: 'JavaScript', icon: '🟨', description: 'The language of the web' },
  { id: 'python', name: 'Python', icon: '🐍', description: 'Known for readability and versatility' },
  { id: 'java', name: 'Java', icon: '☕', description: 'Platform independent and object-oriented' },
  { id: 'csharp', name: 'C#', icon: '🎮', description: 'Microsoft\'s language for .NET development' },
  { id: 'cpp', name: 'C++', icon: '⚡', description: 'High-performance and system programming' },
  { id: 'ruby', name: 'Ruby', icon: '💎', description: 'Designed for programmer happiness' },
  { id: 'php', name: 'PHP', icon: '🐘', description: 'Powers a large portion of the web' },
  { id: 'go', name: 'Go', icon: '🐹', description: 'Simple and efficient compiled language' },
  { id: 'rust', name: 'Rust', icon: '🦀', description: 'Focus on safety and performance' },
  { id: 'other', name: 'Other', icon: '🔮', description: 'Tell us about your preferred language' },
];

export default function LanguagePage() {
  const router = useRouter();
  const { surveyData, updateSurveyData } = useSurvey();
  const [selectedLanguage, setSelectedLanguage] = useState(surveyData.language || '');
  const [otherLanguage, setOtherLanguage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLanguage) {
      setError('Please select a programming language');
      return;
    }

    const languageValue = selectedLanguage === 'other' ? otherLanguage : selectedLanguage;

    if (selectedLanguage === 'other' && !otherLanguage) {
      setError('Please specify your preferred language');
      return;
    }

    updateSurveyData({ language: languageValue });
    router.push('/survey/age');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Programming Language
        </h1>
        <div className="rounded-full bg-blue-800 bg-opacity-20 px-4 py-2 text-blue-300">
          Step 1 of 4
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-medium text-blue-300">
            Which programming language do you prefer to use?
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {languages.map((language) => (
              <div
                key={language.id}
                onClick={() => {
                  setSelectedLanguage(language.id);
                  setError('');
                }}
                className={`cursor-pointer rounded-xl p-4 transition-all duration-300 ${
                  selectedLanguage === language.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg transform scale-105'
                    : 'bg-blue-800 bg-opacity-20 hover:bg-opacity-40'
                }`}
              >
                <div className="mb-2 text-3xl">{language.icon}</div>
                <h3 className="text-lg font-medium text-blue-200">{language.name}</h3>
                <p className="mt-1 text-sm text-blue-400">{language.description}</p>
              </div>
            ))}
          </div>

          {selectedLanguage === 'other' && (
            <div className="mt-4">
              <label htmlFor="otherLanguage" className="mb-2 block text-sm font-medium text-blue-300">
                Please specify your preferred language:
              </label>
              <input
                type="text"
                id="otherLanguage"
                value={otherLanguage}
                onChange={(e) => {
                  setOtherLanguage(e.target.value);
                  setError('');
                }}
                className="w-full rounded-lg border border-blue-500 bg-blue-800 bg-opacity-20 p-3 text-blue-200 placeholder-blue-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your preferred language"
              />
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-red-500 bg-opacity-20 p-3 text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-blue-500 p-4 px-6 py-3 font-medium text-blue-200 transition-all duration-300 hover:border-purple-500"
          >
            <span className="relative z-10">Continue</span>
            <span className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-200 group-hover:translate-y-full"></span>
          </button>
        </div>
      </form>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return <SurveyLayout>{children}</SurveyLayout>;
}