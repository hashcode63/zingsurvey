'use client';
import React, { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function SettingsPage() {
  const { isSignedIn, user } = useAuth();

  const [settings, setSettings] = useState({
    surveySettings: {
      aboveEighteenPrice: 5000,
      belowEighteenPrice: 3000,
      enableAdditionalQuestions: true,
      requirePayment: true
    },
    notifications: {
      emailNotifications: true,
      newResponseNotification: true,
      paymentNotification: true,
      weeklyReportNotification: true
    },
    account: {
      name: user?.fullName || '',
      email: user?.emailAddresses[0]?.emailAddress || '',
      password: '',
      confirmPassword: ''
    },
    appearance: {
      theme: 'dark',
      accentColor: 'indigo'
    }
  });

  const [activeTab, setActiveTab] = useState('survey');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      setError('');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check for password confirmation match if updating password
      if (settings.account.password && settings.account.password !== settings.account.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Please login to access settings</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Admin Settings
          </h1>
          <p className="text-gray-400 mt-2">
            Configure your survey application preferences
          </p>
        </header>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-500/20 border border-red-500/50 text-white">
            {error}
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 mb-6 rounded-xl bg-green-500/20 border border-green-500/50 text-white">
            Settings saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-gray-800/50 rounded-2xl border border-white/5 p-6 backdrop-blur-lg h-fit">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('survey')}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 ${
                  activeTab === 'survey' 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-gray-700/50 text-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                </svg>
                <span>Survey Settings</span>
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 ${
                  activeTab === 'notifications' 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-gray-700/50 text-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <span>Notifications</span>
              </button>
              
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 ${
                  activeTab === 'account' 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-gray-700/50 text-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Account</span>
              </button>
              
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 ${
                  activeTab === 'appearance' 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-gray-700/50 text-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                </svg>
                <span>Appearance</span>
              </button>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 bg-gray-800/50 rounded-2xl border border-white/5 p-6 backdrop-blur-lg">
            {activeTab === 'survey' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Survey Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Payment Amount for Users Above 18 (NGN)
                    </label>
                    <input
                      type="number"
                      value={settings.surveySettings.aboveEighteenPrice}
                      onChange={(e) => handleSettingChange('surveySettings', 'aboveEighteenPrice', parseInt(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Payment Amount for Users Below 18 (NGN)
                    </label>
                    <input
                      type="number"
                      value={settings.surveySettings.belowEighteenPrice}
                      onChange={(e) => handleSettingChange('surveySettings', 'belowEighteenPrice', parseInt(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="enableAdditionalQuestions"
                      type="checkbox"
                      checked={settings.surveySettings.enableAdditionalQuestions}
                      onChange={(e) => handleSettingChange('surveySettings', 'enableAdditionalQuestions', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 bg-gray-700 border-gray-600"
                    />
                    <label htmlFor="enableAdditionalQuestions" className="ml-3 text-sm font-medium text-gray-300">
                      Enable Additional Questions Section
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="requirePayment"
                      type="checkbox"
                      checked={settings.surveySettings.requirePayment}
                      onChange={(e) => handleSettingChange('surveySettings', 'requirePayment', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 bg-gray-700 border-gray-600"
                    />
                    <label htmlFor="requirePayment" className="ml-3 text-sm font-medium text-gray-300">
                      Require Payment to Complete Survey
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-400">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                    <div>
                      <h3 className="font-medium">New Response Notification</h3>
                      <p className="text-sm text-gray-400">Get notified when someone completes the survey</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.notifications.newResponseNotification}
                        onChange={(e) => handleSettingChange('notifications', 'newResponseNotification', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                    <div>
                      <h3 className="font-medium">Payment Notification</h3>
                      <p className="text-sm text-gray-400">Get notified for new payments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.notifications.paymentNotification}
                        onChange={(e) => handleSettingChange('notifications', 'paymentNotification', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                    <div>
                      <h3 className="font-medium">Weekly Report</h3>
                      <p className="text-sm text-gray-400">Receive weekly summary of survey activity</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.notifications.weeklyReportNotification}
                        onChange={(e) => handleSettingChange('notifications', 'weeklyReportNotification', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'account' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={settings.account.name}
                      onChange={(e) => handleSettingChange('account', 'name', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={settings.account.email}
                      onChange={(e) => handleSettingChange('account', 'email', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password (leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      value={settings.account.password}
                      onChange={(e) => handleSettingChange('account', 'password', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={settings.account.confirmPassword}
                      onChange={(e) => handleSettingChange('account', 'confirmPassword', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Appearance Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-4">
                      Theme
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                        className={`cursor-pointer rounded-xl p-4 border ${
                          settings.appearance.theme === 'dark'
                            ? 'border-indigo-500 ring-2 ring-indigo-500'
                            : 'border-gray-600'
                        }`}
                      >
                        <div className="h-24 bg-gray-900 rounded-lg flex items-center justify-center shadow-lg">
                          <div className="w-20 h-4 bg-indigo-600 rounded-full"></div>
                        </div>
                        <div className="mt-3 text-center font-medium">Dark Theme</div>
                      </div>
                      
                      <div
                        onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                        className={`cursor-pointer rounded-xl p-4 border ${
                          settings.appearance.theme === 'light'
                            ? 'border-indigo-500 ring-2 ring-indigo-500'
                            : 'border-gray-600'
                        }`}
                      >
                        <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center shadow-lg">
                          <div className="w-20 h-4 bg-indigo-600 rounded-full"></div>
                        </div>
                        <div className="mt-3 text-center font-medium">Light Theme</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-4">
                      Accent Color
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {['indigo', 'purple', 'pink', 'blue'].map(color => (
                        <div
                          key={color}
                          onClick={() => handleSettingChange('appearance', 'accentColor', color)}
                          className={`cursor-pointer rounded-xl flex flex-col items-center p-3 border ${
                            settings.appearance.accentColor === color
                              ? 'border-white ring-2 ring-white'
                              : 'border-gray-600'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full bg-${color}-500`}></div>
                          <div className="mt-2 text-xs capitalize">{color}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium flex items-center space-x-2 transition-all duration-300 disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}