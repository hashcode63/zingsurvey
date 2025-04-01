'use client';
import React, { useState, useEffect } from 'react';
import { fetchLanguageAnalytics } from '../../../../src/utils/api';
import { useAuth } from '../../../../src/contexts/AuthContext';

export default function LanguageAnalyticsPage() {
  const { isAuthenticated } = useAuth();
  const [analytics, setAnalytics] = useState({
    languages: [],
    totalResponses: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadAnalytics = async () => {
      try {
        const data = await fetchLanguageAnalytics();
        setAnalytics({
          languages: data.languages || [],
          totalResponses: data.totalResponses || 0,
          loading: false,
          error: null,
        });
      } catch (error) {
        setAnalytics((prev) => ({
          ...prev,
          loading: false,
          error: 'Failed to load language analytics',
        }));
      }
    };

    loadAnalytics();
  }, [isAuthenticated]);

  if (analytics.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
        <div className="animate-pulse text-blue-400 text-xl">Loading analytics...</div>
      </div>
    );
  }

  if (analytics.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-8">
        <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-blue-200">
          {analytics.error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-6 text-blue-200">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Language Preferences Analytics
          </h1>
          <p className="text-blue-400 mt-2">
            Overview of programming language preferences from {analytics.totalResponses} survey responses
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 bg-gradient-to-br from-blue-800 to-purple-800 rounded-2xl border border-blue-500/30 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Programming Language Distribution</h2>
            <div className="h-80 flex items-end space-x-2">
              {analytics.languages.map((lang, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all hover:from-blue-400 hover:to-purple-400"
                    style={{
                      height: `${(lang.count / Math.max(...analytics.languages.map((l) => l.count))) * 100}%`,
                      minHeight: '20px',
                    }}
                  ></div>
                  <div className="text-xs mt-2 text-center font-medium text-blue-200">{lang.name}</div>
                  <div className="text-lg font-bold text-blue-100">{lang.count}</div>
                  <div className="text-xs text-blue-400">
                    {((lang.count / analytics.totalResponses) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-800 to-pink-800 rounded-2xl border border-blue-500/30 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Top Languages</h2>
            <div className="space-y-4">
              {analytics.languages
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
                .map((lang, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-blue-200">{lang.name}</span>
                        <span className="text-blue-400">{lang.count} responses</span>
                      </div>
                      <div className="w-full bg-blue-700 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
                          style={{ width: `${(lang.count / analytics.totalResponses) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-800 to-teal-800 rounded-2xl border border-blue-500/30 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">All Languages Data</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-blue-200">
              <thead className="text-xs uppercase bg-blue-700/50 rounded-lg text-blue-300">
                <tr>
                  <th className="px-6 py-3 rounded-l-lg">Language</th>
                  <th className="px-6 py-3">Responses</th>
                  <th className="px-6 py-3">Percentage</th>
                  <th className="px-6 py-3 rounded-r-lg">Trend</th>
                </tr>
              </thead>
              <tbody>
                {analytics.languages
                  .sort((a, b) => b.count - a.count)
                  .map((lang, index) => (
                    <tr key={index} className="border-b border-blue-700/30">
                      <td className="px-6 py-4 font-medium whitespace-nowrap">{lang.name}</td>
                      <td className="px-6 py-4">{lang.count}</td>
                      <td className="px-6 py-4">
                        {((lang.count / analytics.totalResponses) * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            lang.trend > 0
                              ? 'bg-green-500/20 text-green-400'
                              : lang.trend < 0
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {lang.trend > 0 ? '+' : ''}
                          {lang.trend}%
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}