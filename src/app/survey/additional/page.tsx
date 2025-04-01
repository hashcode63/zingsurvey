'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSurvey } from '../../../../src/contexts/SurveyContext';
import SurveyLayout from '../../../../src/components/layouts/SurveyLayout';

export default function AdditionalQuestionsPage() {
  const router = useRouter();
  const { surveyData, updateSurveyData } = useSurvey();

  const [formData, setFormData] = useState({
    experience: surveyData.additionalResponses?.experience || '',
    framework: surveyData.additionalResponses?.framework || '',
    learningStyle: surveyData.additionalResponses?.learningStyle || '',
    careerGoal: surveyData.additionalResponses?.careerGoal || '',
    challenge: surveyData.additionalResponses?.challenge || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    // Validate experience (required)
    if (!formData.experience) {
      newErrors.experience = 'Please select your experience level';
    }

    // If there are errors, show them
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update survey data and navigate to summary
    updateSurveyData({
      additionalResponses: formData,
    });

    router.push('/survey/summary');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Additional Questions
        </h1>
        <div className="rounded-full bg-blue-800 bg-opacity-20 px-4 py-2 text-blue-300">
          Step 3 of 4
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="experience" className="mb-2 block text-lg font-medium text-blue-300">
            How much programming experience do you have? <span className="text-red-400">*</span>
          </label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.experience
                ? 'border-red-500 bg-red-500 bg-opacity-10'
                : 'border-blue-500 bg-blue-800 bg-opacity-20'
            } p-3 text-blue-200 placeholder-blue-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value="" className="bg-gray-800">Select your experience level</option>
            <option value="beginner" className="bg-gray-800">Beginner (less than 1 year)</option>
            <option value="intermediate" className="bg-gray-800">Intermediate (1-3 years)</option>
            <option value="experienced" className="bg-gray-800">Experienced (3-5 years)</option>
            <option value="advanced" className="bg-gray-800">Advanced (5+ years)</option>
          </select>
          {errors.experience && (
            <p className="mt-1 text-sm text-red-400">{errors.experience}</p>
          )}
        </div>

        <div>
          <label htmlFor="framework" className="mb-2 block text-lg font-medium text-blue-300">
            Do you have a preferred framework or library?
          </label>
          <input
            type="text"
            id="framework"
            name="framework"
            value={formData.framework}
            onChange={handleChange}
            className="w-full rounded-lg border border-blue-500 bg-blue-800 bg-opacity-20 p-3 text-blue-200 placeholder-blue-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="E.g., React, Angular, Django, etc."
          />
        </div>

        <div>
          <label htmlFor="learningStyle" className="mb-2 block text-lg font-medium text-blue-300">
            How do you prefer to learn programming?
          </label>
          <select
            id="learningStyle"
            name="learningStyle"
            value={formData.learningStyle}
            onChange={handleChange}
            className="w-full rounded-lg border border-blue-500 bg-blue-800 bg-opacity-20 p-3 text-blue-200 placeholder-blue-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="" className="bg-gray-800">Select your learning style</option>
            <option value="video" className="bg-gray-800">Video tutorials</option>
            <option value="documentation" className="bg-gray-800">Reading documentation</option>
            <option value="projects" className="bg-gray-800">Building projects</option>
            <option value="courses" className="bg-gray-800">Structured courses</option>
            <option value="community" className="bg-gray-800">Community/forums</option>
          </select>
        </div>

        <div>
          <label htmlFor="careerGoal" className="mb-2 block text-lg font-medium text-blue-300">
            What is your primary career goal with programming?
          </label>
          <select
            id="careerGoal"
            name="careerGoal"
            value={formData.careerGoal}
            onChange={handleChange}
            className="w-full rounded-lg border border-blue-500 bg-blue-800 bg-opacity-20 p-3 text-blue-200 placeholder-blue-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="" className="bg-gray-800">Select your career goal</option>
            <option value="frontend" className="bg-gray-800">Frontend Developer</option>
            <option value="backend" className="bg-gray-800">Backend Developer</option>
            <option value="fullstack" className="bg-gray-800">Full Stack Developer</option>
            <option value="mobile" className="bg-gray-800">Mobile Developer</option>
            <option value="ai" className="bg-gray-800">AI/Machine Learning Engineer</option>
            <option value="game" className="bg-gray-800">Game Developer</option>
            <option value="hobby" className="bg-gray-800">Just a hobby</option>
            <option value="other" className="bg-gray-800">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="challenge" className="mb-2 block text-lg font-medium text-blue-300">
            What's your biggest challenge in programming?
          </label>
          <textarea
            id="challenge"
            name="challenge"
            value={formData.challenge}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border border-blue-500 bg-blue-800 bg-opacity-20 p-3 text-blue-200 placeholder-blue-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Describe any challenges you face while learning or working with programming..."
          ></textarea>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => router.push('/survey/age')}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-blue-500 p-4 px-6 py-3 font-medium text-blue-300 transition-all duration-300 hover:border-blue-300"
          >
            <span className="relative z-10">Back</span>
          </button>

          <button
            type="submit"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-purple-500 p-4 px-6 py-3 font-medium text-blue-300 transition-all duration-300 hover:border-purple-300"
          >
            <span className="relative z-10">Continue</span>
            <span className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200 group-hover:translate-y-full"></span>
          </button>
        </div>
      </form>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return <SurveyLayout>{children}</SurveyLayout>;
}