'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SurveyData {
  language: string;
  age: string;
  additionalResponses: Record<string, string>;
  paymentStatus: 'pending' | 'completed' | 'failed';
  amount: number;
  paymentDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    name: string;
  };
}

interface SurveyContextType {
  surveyData: SurveyData;
  updateSurveyData: (data: Partial<SurveyData>) => void;
  resetSurvey: () => void;
  isComplete: boolean;
  setIsComplete: (value: boolean) => void;
}

const initialSurveyData: SurveyData = {
  language: '',
  age: '',
  additionalResponses: {},
  paymentStatus: 'pending',
  amount: 0,
};

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [surveyData, setSurveyData] = useState<SurveyData>(initialSurveyData);
  const [isComplete, setIsComplete] = useState(false);

  const updateSurveyData = (data: Partial<SurveyData>) => {
    setSurveyData((prev) => ({ ...prev, ...data }));
  };

  const resetSurvey = () => {
    setSurveyData(initialSurveyData);
    setIsComplete(false);
  };

  return (
    <SurveyContext.Provider
      value={{
        surveyData,
        updateSurveyData,
        resetSurvey,
        isComplete,
        setIsComplete,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = (): SurveyContextType => {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};