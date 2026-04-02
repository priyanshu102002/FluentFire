'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserProfile, createUserProfile, UserProfile } from '@/lib/user-client';
import { getDailyProgress } from '@/lib/progress-client';
import { format, subDays } from 'date-fns';
import { Flame } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      try {
        let userProfile = await getUserProfile(user.uid);
        if (!userProfile) {
          await createUserProfile(user.uid, user.email || '');
          userProfile = { email: user.email || '', streak: 0 };
        } else {
          // Calculate effective streak for display
          if (userProfile.lastCompletedDate) {
            const todayStr = format(new Date(), 'yyyy-MM-dd');
            const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
            if (userProfile.lastCompletedDate !== todayStr && userProfile.lastCompletedDate !== yesterdayStr) {
              userProfile.streak = 0;
            }
          }
        }
        setProfile(userProfile);

        const progress = await getDailyProgress(user.uid);
        if (progress && progress.completed) {
          setIsCompletedToday(true);
        }
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-zinc-700 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-8 flex justify-between items-center max-w-4xl mx-auto w-full">
        <div className="flex items-center space-x-2 text-zinc-400">
          <Flame className="w-4 h-4 text-orange-500/80" />
          <span className="text-sm font-medium">{profile?.streak || 0} Day Streak</span>
        </div>
        <button 
          onClick={logout}
          className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors"
        >
          Sign out
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-12 max-w-sm w-full">
          <div className="space-y-3">
            <h2 className="text-3xl font-light text-zinc-100 tracking-tight">
              Welcome back.
            </h2>
            <p className="text-sm text-zinc-500">Ready for your daily practice?</p>
          </div>

          <div className="pt-12 border-t border-zinc-900">
            {isCompletedToday ? (
              <div className="space-y-2">
                <p className="text-zinc-300 font-medium">Practice complete.</p>
                <p className="text-sm text-zinc-600">See you tomorrow.</p>
              </div>
            ) : (
              <button
                onClick={() => router.push('/challenge')}
                className="w-full bg-zinc-100 text-zinc-900 py-3.5 rounded-lg text-sm font-medium hover:bg-white transition-colors"
              >
                Start Today's Practice
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
