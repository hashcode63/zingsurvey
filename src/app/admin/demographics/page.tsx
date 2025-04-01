'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../src/contexts/AuthContext';
import AdminLayout from '../../../../src/components/layouts/AdminLayout';
import { fetchDemographicsData } from '../../../../src/utils/api';

interface DemographicsData {
  totalRespondents: number;
  ageGroups: {
    under18: number;
    over18: number;
  };
  agePercentages: {
    under18: number;
    over18: number;
  };
  respondentsByAge: {
    id: string;
    name: string;
    email: string;
    age: string;
    language: string;
    paymentAmount: number;
    paymentStatus: string;
    submittedAt: string;
  }[];
}

export default function DemographicsPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [data, setData] = useState<DemographicsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'under18' | 'over18'>('over18');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const loadDemographicsData = async () => {
      if (isAuthenticated) {
        try {
          setIsLoading(true);
          const responseData = await fetchDemographicsData();
          setData(responseData);
        } catch (error) {
          console.error('Error fetching demographics data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadDemographicsData();
  }, [isAuthenticated]);

  const filteredRespondents = data?.respondentsByAge.filter(
    (respondent) => {
      const matchesAge = respondent.age === activeTab;
      const matchesSearch = searchTerm === '' || 
        respondent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        respondent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        respondent.language.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesAge && matchesSearch;
    }
  );

  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Demographics</h1>
        <p className="mt-2 text-white text-opacity-80">
          Analyze respondent demographics and view age distribution.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-teal-500"></div>
          <span className="ml-3 text-white">Loading demographics data...</span>
        </div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Total Respondents */}
            <div className="rounded-xl bg-white bg-opacity-5 p-6">
              <h3 className="text-sm font-medium text-white text-opacity-80">Total Respondents</h3>
              <p className="mt-2 text-3xl font-bold text-white">{data?.totalRespondents || 0}</p>
            </div>
            
            {/* Under 18 */}
            <div 
              className={`cursor-pointer rounded-xl bg-white bg-opacity-5 p-6 transition-all hover:bg-opacity-10 ${
                activeTab === 'under18' ? 'border-2 border-teal-400' : ''
              }`}
              onClick={() => setActiveTab('under18')}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white text-opacity-80">Under 18</h3>
                <div className="rounded-full bg-teal-500 bg-opacity-20 px-2 py-0.5 text-xs font-medium text-teal-400">
                  ₦3,000
                </div>
              </div>
              <p className="mt-2 text-3xl font-bold text-white">{data?.ageGroups.under18 || 0}</p>
              <p className="mt-1 text-sm text-white text-opacity-80">
                {data?.agePercentages.under18.toFixed(1) || 0}% of respondents
              </p>
            </div>
            
            {/* Over 18 */}
            <div 
              className={`cursor-pointer rounded-xl bg-white bg-opacity-5 p-6 transition-all hover:bg-opacity-10 ${
                activeTab === 'over18' ? 'border-2 border-teal-400' : ''
              }`}
              onClick={() => setActiveTab('over18')}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white text-opacity-80">18 or Above</h3>
                <div className="rounded-full bg-blue-500 bg-opacity-20 px-2 py-0.5 text-xs font-medium text-blue-400">
                  ₦5,000
                </div>
              </div>
              <p className="mt-2 text-3xl font-bold text-white">{data?.ageGroups.over18 || 0}</p>
              <p className="mt-1 text-sm text-white text-opacity-80">
                {data?.agePercentages.over18.toFixed(1) || 0}% of respondents
              </p>
            </div>
          </div>
          
          <div className="mb-6 rounded-xl bg-white bg-opacity-5 p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <h2 className="text-xl font-semibold text-white">
                {activeTab === 'under18' ? 'Under 18' : '18 or Above'} Respondents
              </h2>
              
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-white text-opacity-50" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, or language..."
                  className="w-full rounded-lg border border-white border-opacity-20 bg-white bg-opacity-5 py-2 pl-10 pr-4 text-white placeholder-white placeholder-opacity-50 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white border-opacity-10 text-left">
                    <th className="pb-3 text-sm font-medium text-white text-opacity-80">Name</th>
                    <th className="pb-3 text-sm font-medium text-white text-opacity-80">Email</th>
                    <th className="pb-3 text-sm font-medium text-white text-opacity-80">Language</th>
                    <th className="pb-3 text-sm font-medium text-white text-opacity-80">Payment</th>
                    <th className="pb-3 text-sm font-medium text-white text-opacity-80">Date</th>
                    <th className="pb-3 text-sm font-medium text-white text-opacity-80">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRespondents && filteredRespondents.length > 0 ? (
                    filteredRespondents.map((respondent) => (
                      <tr 
                        key={respondent.id} 
                        className="border-b border-white border-opacity-5 text-white transition-colors hover:bg-white hover:bg-opacity-5"
                      >
                        <td className="py-4">{respondent.name}</td>
                        <td className="py-4">{respondent.email}</td>
                        <td className="py-4">
                          <span className="inline-flex items-center rounded-full bg-blue-500 bg-opacity-20 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                            {respondent.language}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <span className="mr-2">
                              {new Intl.NumberFormat('en-NG', {
                                style: 'currency',
                                currency: 'NGN'
                              }).format(respondent.paymentAmount)}
                            </span>
                            {respondent.paymentStatus === 'completed' ? (
                              <span className="inline-flex items-center rounded-full bg-green-500 bg-opacity-20 px-2 py-0.5 text-xs font-medium text-green-400">
                                Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-red-500 bg-opacity-20 px-2 py-0.5 text-xs font-medium text-red-400">
                                Pending
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4">{new Date(respondent.submittedAt).toLocaleDateString()}</td>
                        <td className="py-4">
                          <button 
                            onClick={() => router.push(`/admin/responses/${respondent.id}`)}
                            className="rounded-lg bg-white bg-opacity-10 px-2 py-1 text-xs text-white transition-colors hover:bg-opacity-20"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-white text-opacity-80">
                        {searchTerm ? 'No matching respondents found' : 'No respondents in this age group'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}