'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSurvey } from '../../../../src/contexts/SurveyContext';
import SurveyLayout from '../../../../src/components/layouts/SurveyLayout';
import { api } from '../../../../src/utils/api';

export default function PaymentPage() {
  const router = useRouter();
  const { surveyData, updateSurveyData } = useSurvey();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentAmount = surveyData.age === 'under18' ? 3000 : 5000;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber.trim() || !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = 'Please enter the card holder name';
    }

    if (!formData.expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }

    if (!formData.cvv.trim() || !/^\d{3}$/.test(formData.cvv)) {
      newErrors.cvv = 'Please enter a valid 3-digit CVV';
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Update payment info in context
      updateSurveyData({
        paymentInfo: {
          amount: paymentAmount,
          email: formData.email,
          paymentDate: new Date().toISOString(),
          status: 'completed',
        },
      });

      // Submit the entire survey data
      await api.submitSurvey({
        ...surveyData,
        paymentInfo: {
          amount: paymentAmount,
          email: formData.email,
          paymentDate: new Date().toISOString(),
          status: 'completed',
        },
      });

      // Redirect to thank you page
      router.push('/survey/thank-you');
    } catch (error) {
      console.error('Payment submission error:', error);
      setErrors({ submit: 'There was an error processing your payment. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <SurveyLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Payment
        </h1>
        <div className="rounded-full bg-blue-800 bg-opacity-20 px-4 py-2 text-blue-300">
          Step 5 of 5
        </div>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-gray-900 via-blue-900 to-black p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-blue-300">Payment Details</h2>
          <div className="text-xl font-bold text-teal-400">
            {new Intl.NumberFormat('en-NG', {
              style: 'currency',
              currency: 'NGN',
            }).format(paymentAmount)}
          </div>
        </div>

        {errors.submit && (
          <div className="mb-6 rounded-lg bg-red-500 bg-opacity-20 p-4 text-red-200">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-blue-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-black bg-opacity-30 p-3 text-blue-200 placeholder-blue-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                errors.email ? 'border-red-500' : 'border-blue-500'
              }`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="cardNumber" className="block text-sm font-medium text-blue-300">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formatCardNumber(formData.cardNumber)}
              onChange={handleChange}
              maxLength={19}
              className={`w-full rounded-lg border bg-black bg-opacity-30 p-3 text-blue-200 placeholder-blue-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                errors.cardNumber ? 'border-red-500' : 'border-blue-500'
              }`}
              placeholder="1234 5678 9012 3456"
            />
            {errors.cardNumber && <p className="text-sm text-red-400">{errors.cardNumber}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="cardHolder" className="block text-sm font-medium text-blue-300">
              Card Holder Name
            </label>
            <input
              type="text"
              id="cardHolder"
              name="cardHolder"
              value={formData.cardHolder}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-black bg-opacity-30 p-3 text-blue-200 placeholder-blue-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                errors.cardHolder ? 'border-red-500' : 'border-blue-500'
              }`}
              placeholder="John Doe"
            />
            {errors.cardHolder && <p className="text-sm text-red-400">{errors.cardHolder}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="expiryDate" className="block text-sm font-medium text-blue-300">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                maxLength={5}
                className={`w-full rounded-lg border bg-black bg-opacity-30 p-3 text-blue-200 placeholder-blue-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                  errors.expiryDate ? 'border-red-500' : 'border-blue-500'
                }`}
                placeholder="MM/YY"
              />
              {errors.expiryDate && <p className="text-sm text-red-400">{errors.expiryDate}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="cvv" className="block text-sm font-medium text-blue-300">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                maxLength={3}
                className={`w-full rounded-lg border bg-black bg-opacity-30 p-3 text-blue-200 placeholder-blue-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                  errors.cvv ? 'border-red-500' : 'border-blue-500'
                }`}
                placeholder="123"
              />
              {errors.cvv && <p className="text-sm text-red-400">{errors.cvv}</p>}
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => router.push('/survey/summary')}
              className="rounded-lg border border-blue-500 bg-transparent px-6 py-3 text-blue-300 transition-all hover:bg-blue-500 hover:bg-opacity-10"
              disabled={isSubmitting}
            >
              Back
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 px-6 py-3 text-white shadow-lg transition-all hover:from-teal-500 hover:to-blue-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Complete Payment'}
            </button>
          </div>
        </form>
      </div>
    </SurveyLayout>
  );
}