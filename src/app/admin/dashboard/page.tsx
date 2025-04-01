'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import useSWR from 'swr';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUp, ArrowDown, DollarSign, Users, BarChart2, Globe, PieChart as PieChartIcon, Calendar } from 'lucide-react';

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  return res.json();
};

const StatCard = ({ title, value, icon, trend, trendValue, color }) => {
  const TrendIcon = trend === 'up' ? ArrowUp : ArrowDown;
  const trendColor = trend === 'up' ? 'text-green-500' : 'text-red-500';
  
  return (
    <Card className="bg-black bg-opacity-80 border-gray-800 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
            {trendValue && (
              <div className="flex items-center mt-2">
                <TrendIcon className={`h-4 w-4 ${trendColor} mr-1`} />
                <span className={`text-xs ${trendColor}`}>{trendValue}%</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useAuth();

  const { data: stats, error, isLoading } = useSWR(
    isSignedIn ? '/api/dashboard-stats' : null,
    fetcher,
    { refreshInterval: 30000, revalidateOnFocus: true }
  );

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gradient-to-br from-gray-900 to-black">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-800 rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-500 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-900 bg-opacity-20 rounded-lg border border-red-800 text-red-400 text-center max-w-md mx-auto mt-12">
        <p className="font-medium">Error loading dashboard stats</p>
        <button 
          onClick={() => router.refresh()} 
          className="mt-4 px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Format data for charts
  const ageDistributionData = [
    { name: 'Under 18', value: stats.ageDistribution.under18, color: '#3b82f6' },
    { name: 'Over 18', value: stats.ageDistribution.over18, color: '#10b981' }
  ];

  const responsesTrendData = stats.responsesByDay.slice().reverse();

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Welcome, {user?.fullName}
          </h1>
          <p className="text-gray-400">Survey Analytics Dashboard</p>
        </div>
        <div className="px-4 py-2 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-800 flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-blue-400" />
          <span className="text-sm text-blue-300">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Responses" 
          value={stats.totalResponses} 
          icon={<Users className="h-6 w-6 text-white" />} 
          trend="up" 
          trendValue="12.5" 
          color="bg-blue-900 bg-opacity-50" 
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toFixed(2)}`} 
          icon={<DollarSign className="h-6 w-6 text-white" />} 
          trend="up" 
          trendValue="8.3" 
          color="bg-green-900 bg-opacity-50" 
        />
        <StatCard 
          title="Completion Rate" 
          value={`${stats.completionRate.toFixed(1)}%`} 
          icon={<BarChart2 className="h-6 w-6 text-white" />} 
          trend={stats.completionRate > 75 ? 'up' : 'down'} 
          trendValue="4.2" 
          color="bg-purple-900 bg-opacity-50" 
        />
        <StatCard 
          title="Payments Received" 
          value={stats.paymentsReceived} 
          icon={<DollarSign className="h-6 w-6 text-white" />} 
          trend="up" 
          trendValue="15.7" 
          color="bg-yellow-900 bg-opacity-50" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Responses Trend */}
        <Card className="bg-black bg-opacity-80 border-gray-800 overflow-hidden hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-blue-400">Daily Responses</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-8 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responsesTrendData}>
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  activeDot={{ r: 8, fill: '#3b82f6', stroke: '#1e40af', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card className="bg-black bg-opacity-80 border-gray-800 overflow-hidden hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-green-400">Age Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-8 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {ageDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Language */}
        <Card className="bg-black bg-opacity-80 border-gray-800 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-purple-400 flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Top Language
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {stats.topLanguage ? (
              <div>
                <h3 className="text-xl font-bold text-white">{stats.topLanguage.name}</h3>
                <div className="mt-4 bg-gray-800 h-4 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    style={{ width: `${stats.topLanguage.percentage}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-gray-400 text-sm">
                  {stats.topLanguage.count} responses ({stats.topLanguage.percentage.toFixed(1)}%)
                </p>
              </div>
            ) : (
              <p className="text-gray-400">No language data available</p>
            )}
          </CardContent>
        </Card>

        {/* Average Age */}
        <Card className="bg-black bg-opacity-80 border-gray-800 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-yellow-400 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Average Age
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            {stats.averageAge ? (
              <>
                <div className="text-4xl font-bold text-white">{Math.round(stats.averageAge)}</div>
                <p className="text-gray-400 mt-2">years old</p>
              </>
            ) : (
              <p className="text-gray-400">No age data available</p>
            )}
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card className="bg-black bg-opacity-80 border-gray-800 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-blue-400 flex items-center">
              <BarChart2 className="h-5 w-5 mr-2" />
              Survey Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  stroke="#374151" 
                  strokeWidth="10"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  stroke="#3b82f6" 
                  strokeWidth="10"
                  strokeDasharray={`${stats.completionRate * 2.51} 251`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{stats.completionRate.toFixed(0)}%</span>
              </div>
            </div>
            <p className="text-gray-400 mt-4 text-sm">
              {Math.round(stats.totalResponses * stats.completionRate / 100)} completed surveys out of {stats.totalResponses}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}