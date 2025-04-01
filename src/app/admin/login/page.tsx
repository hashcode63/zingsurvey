'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, SignIn } from '@clerk/nextjs';

export default function AdminLoginPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/admin/dashboard');
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 to-indigo-900">
        <div className="p-8 rounded-2xl bg-black/30 backdrop-blur-xl text-white text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 to-indigo-900">
      <div className="w-full max-w-md p-8 space-y-8 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 text-white">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight">Admin Login</h2>
          <p className="mt-2 text-sm text-indigo-300">Sign in to access your dashboard</p>
        </div>
        <div className="mt-8">
          <SignIn routing="hash" afterSignInUrl="/admin/dashboard" />
        </div>
      </div>
    </div>
  );
}