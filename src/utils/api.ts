// Mock database for demo purposes
let surveyResponses: any[] = [];
let adminUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123', // In real app, you'd use hashed passwords
  role: 'admin',
};

export const api = {
  // Survey Endpoints
  submitSurvey: async (data: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newResponse = {
      id: `survey-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...data
    };
    
    surveyResponses.push(newResponse);
    return { success: true, data: newResponse };
  },
  
  // Admin Authentication
  loginAdmin: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, you'd check against database and use proper auth
    if (email === adminUser.email && password === adminUser.password) {
      const { password, ...userWithoutPassword } = adminUser;
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, message: 'Invalid credentials' };
  },
  
  // Admin Data Endpoints
  getSurveyResponses: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data: surveyResponses };
  },
  
  getSurveyResponse: async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const response = surveyResponses.find(r => r.id === id);
    
    if (!response) {
      return { success: false, message: 'Response not found' };
    }
    
    return { success: true, data: response };
  },
  
  getDemographicsData: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const totalResponses = surveyResponses.length;
    const under18Count = surveyResponses.filter(r => r.age === 'under18').length;
    const over18Count = surveyResponses.filter(r => r.age === 'over18').length;
    
    return {
      success: true,
      data: {
        totalResponses,
        ageGroups: {
          under18: {
            count: under18Count,
            percentage: totalResponses ? (under18Count / totalResponses) * 100 : 0
          },
          over18: {
            count: over18Count,
            percentage: totalResponses ? (over18Count / totalResponses) * 100 : 0
          }
        }
      }
    };
  },
  
  getLanguageAnalytics: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const languageCounts: Record<string, number> = {};
    
    surveyResponses.forEach(response => {
      const lang = response.language;
      if (lang) {
        languageCounts[lang] = (languageCounts[lang] || 0) + 1;
      }
    });
    
    // Sort languages by popularity
    const sortedLanguages = Object.entries(languageCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([language, count]) => ({
        language,
        count,
        percentage: (count / surveyResponses.length) * 100
      }));
    
    return {
      success: true,
      data: {
        languages: sortedLanguages,
        mostPopular: sortedLanguages.length > 0 ? sortedLanguages[0].language : null
      }
    };
  },
  
  getPaymentAnalytics: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const completed = surveyResponses.filter(r => r.paymentStatus === 'completed');
    const pending = surveyResponses.filter(r => r.paymentStatus === 'pending');
    const failed = surveyResponses.filter(r => r.paymentStatus === 'failed');
    
    const totalRevenue = completed.reduce((sum, r) => sum + (r.amount || 0), 0);
    
    return {
      success: true,
      data: {
        totalRevenue,
        paymentStatus: {
          completed: completed.length,
          pending: pending.length,
          failed: failed.length,
        },
        recentPayments: completed.slice(0, 5)
      }
    };
  }
};

export async function fetchDashboardStats() {
  try {
    const response = await fetch('/api/dashboard-stats'); // Replace with your actual API endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

// For demo purposes, add some sample data
const sampleData = [
  {
    id: 'survey-1',
    createdAt: '2025-03-28T10:30:00Z',
    language: 'JavaScript',
    age: 'over18',
    additionalResponses: {
      experience: '3-5 years',
      preference: 'frontend'
    },
    paymentStatus: 'completed',
    amount: 5000,
    paymentDetails: {
      name: 'John Doe',
      lastFour: '4242'
    }
  },
  {
    id: 'survey-2',
    createdAt: '2025-03-28T11:45:00Z',
    language: 'Python',
    age: 'under18',
    additionalResponses: {
      experience: '1-2 years',
      preference: 'backend'
    },
    paymentStatus: 'completed',
    amount: 3000,
    paymentDetails: {
      name: 'Jane Smith',
      lastFour: '1234'
    }
  },
  {
    id: 'survey-3',
    createdAt: '2025-03-29T09:15:00Z',
    language: 'JavaScript',
    age: 'under18',
    additionalResponses: {
      experience: 'Less than 1 year',
      preference: 'fullstack'
    },
    paymentStatus: 'pending',
    amount: 3000
  }
];

surveyResponses = [...sampleData];