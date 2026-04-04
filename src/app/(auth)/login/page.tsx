'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/challenge');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-zinc-700 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-12 text-center">
        <div className="space-y-3">
          <h1 className="text-3xl font-light tracking-tight text-zinc-100">
            Daily English
          </h1>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-zinc-900 bg-zinc-100 hover:bg-white transition-colors cursor-pointer"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
