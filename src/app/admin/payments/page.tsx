'use client';
import React, { useState, useEffect } from 'react';
import { fetchPaymentsData } from '../../../../src/utils/api';
import { useAuth } from '../../../../src/contexts/AuthContext';

type PaymentRecord = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  ageGroup: 'above18' | 'below18';
  date: string;
};

export default function PaymentsPage() {
  const { isAuthenticated } = useAuth();
  const [payments, setPayments] = useState<{
    records: PaymentRecord[];
    loading: boolean;
    error: string | null;
    stats: {
      totalRevenue: number;
      above18Count: number;
      below18Count: number;
      above18Revenue: number;
      below18Revenue: number;
      completedCount: number;
      pendingCount: number;
      failedCount: number;
    }
  }>({
    records: [],
    loading: true,
    error: null,
    stats: {
      totalRevenue: 0,
      above18Count: 0,
      below18Count: 0,
      above18Revenue: 0,
      below18Revenue: 0,
      completedCount: 0,
      pendingCount: 0,
      failedCount: 0
    }
  });
  
  const [filter, setFilter] = useState({
    status: 'all',
    ageGroup: 'all',
    searchQuery: ''
  });
  
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadPayments = async () => {
      try {
        const data = await fetchPaymentsData();
        
        // Calculate stats
        const stats = data.records.reduce((acc, payment) => {
          if (payment.status === 'completed') {
            acc.totalRevenue += payment.amount;
            acc.completedCount++;
            
            if (payment.ageGroup === 'above18') {
              acc.above18Count++;
              acc.above18Revenue += payment.amount;
            } else {
              acc.below18Count++;
              acc.below18Revenue += payment.amount;
            }
          } else if (payment.status === 'pending') {
            acc.pendingCount++;
          } else if (payment.status === 'failed') {
            acc.failedCount++;
          }
          
          return acc;
        }, {
          totalRevenue: 0,
          above18Count: 0,
          below18Count: 0,
          above18Revenue: 0,
          below18Revenue: 0,
          completedCount: 0,
          pendingCount: 0,
          failedCount: 0
        });
        
        setPayments({
          records: data.records,
          loading: false,
          error: null,
          stats
        });
      } catch (error) {
        setPayments(prev => ({
          ...prev,
          loading: false,
          error: "Failed to load payment data"
        }));
      }
    };
    
    loadPayments();
  }, [isAuthenticated]);
  
  const filteredPayments = payments.records.filter(payment => {
    const matchesStatus = filter.status === 'all' || payment.status === filter.status;
    const matchesAge = filter.ageGroup === 'all' || payment.ageGroup === filter.ageGroup;
    const matchesSearch = !filter.searchQuery || 
      payment.userName.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(filter.searchQuery.toLowerCase());
      
    return matchesStatus && matchesAge && matchesSearch;
  });
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };
  
  if (payments.loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-indigo-400 text-xl">Loading payment data...</div>
      </div>
    );
  }
  
  if (payments.error) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-white">
          {payments.error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Payment Analytics
          </h1>
          <p className="text-gray-400 mt-2">
            Track and manage all payment transactions
          </p>
        </header>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-2xl border border-white/5 p-6 backdrop-blur-lg">
            <h3 className="text-gray-400 text-sm font-medium">Total Revenue</h3>
            <p className="text-3xl font-bold mt-2">{formatCurrency(payments.stats.totalRevenue)}</p>
            <div className="flex items-center mt-2">
              <span className="text-green-400 text-sm">+
                {((payments.stats.totalRevenue / (payments.records.length * 3000)) * 100 - 100).toFixed(1)}%
              </span>
              <span className="text-gray-500 text-sm ml-2">from base price</span>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-2xl border border-white/5 p-6 backdrop-blur-lg">
            <h3 className="text-gray-400 text-sm font-medium">Transactions</h3>
            <p className="text-3xl font-bold mt-2">{payments.stats.completedCount}</p>
            <div className="text-gray-500 text-sm mt-2">
              <span className="inline-block px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs mr-2">
                {payments.stats.completedCount}
              </span>
              Completed
              <span className="inline-block px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs mx-2">
                {payments.stats.pendingCount}
              </span>
              Pending
              <span className="inline-block px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs ml-2">
                {payments.stats.failedCount}
              </span>
              Failed
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-2xl border border-white/5 p-6 backdrop-blur-lg">
            <h3 className="text-gray-400 text-sm font-medium">Above 18 Users</h3>
            <p className="text-3xl font-bold mt-2">{payments.stats.above18Count}</p>
            <div className="flex items-center mt-2">
              <span className="text-indigo-400 text-sm">
                {formatCurrency(payments.stats.above18Revenue)}
              </span>
              <span className="text-gray-500 text-sm ml-2">total revenue</span>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-2xl border border-white/5 p-6 backdrop-blur-lg">
            <h3 className="text-gray-400 text-sm font-medium">Below 18 Users</h3>
            <p className="text-3xl font-bold mt-2">{payments.stats.below18Count}</p>
            <div className="flex items-center mt-2">
              <span className="text-indigo-400 text-sm">
                {formatCurrency(payments.stats.below18Revenue)}
              </span>
              <span className="text-gray-500 text-sm ml-2">total revenue</span>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-gray-800/50 rounded-2xl border border-white/5 p-6 backdrop-blur-lg mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-400 mb-1">
                  Payment Status
                </label>
                <select
                  id="statusFilter"
                  value={filter.status}
                  onChange={(e) => setFilter({...filter, status: e.target.value})}
                  className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="ageFilter" className="block text-sm font-medium text-gray-400 mb-1">
                  Age Group
                </label>
                <select
                  id="ageFilter"
                  value={filter.ageGroup}
                  onChange={(e) => setFilter({...filter, ageGroup: e.target.value})}
                  className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                >
                  <option value="all">All Ages</option>
                  <option value="above18">Above 18</option>
                  <option value="below18">Below 18</option>
                </select>
              </div>
            </div>
            
            <div className="flex-1 max-w-md">
              <label htmlFor="searchFilter" className="block text-sm font-medium text-gray-400 mb-1">
                Search
              </label>
              <input
                type="text"
                id="searchFilter"
                placeholder="Search by name or email..."
                value={filter.searchQuery}
                onChange={(e) => setFilter({...filter, searchQuery: e.target.value})}
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              />
            </div>
          </div>
        </div>
        
        {/* Payments Table */}
        <div className="bg-gray-800/50 rounded-2xl border border-white/5 p-6 backdrop-blur-lg">
          <h2 className="text-xl font-semibold mb-4">Payment Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-700/50 rounded-lg">
                <tr>
                  <th className="px-6 py-3 rounded-l-lg">User</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Age Group</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, index) => (
                  <tr key={payment.id} className="border-b border-gray-700/30">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{payment.userName}</div>
                        <div className="text-gray-400 text-xs">{payment.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(payment.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        payment.ageGroup === 'above18' 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        {payment.ageGroup === 'above18' ? 'Above 18' : 'Below 18'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        payment.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : payment.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-indigo-400 hover:text-indigo-300 mr-3">
                        View
                      </button>
                      <button className="text-gray-400 hover:text-gray-300">
                        Export
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No payment records found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}