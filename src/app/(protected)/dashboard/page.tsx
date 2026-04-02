'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserProfile, createUserProfile, UserProfile } from '@/lib/user-client';
import { getDailyProgress } from '@/lib/progress-client';
import { format, subDays, addDays, startOfDay } from 'date-fns';
import { Flame } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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

  useEffect(() => {
    if (!isCompletedToday) return;

    const updateCountdown = () => {
      const now = new Date();
      const nextDay = addDays(startOfDay(now), 1);
      const diff = nextDay.getTime() - now.getTime();

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [isCompletedToday]);

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
          <Flame 
            className="w-4 h-4" 
            fill={profile && profile.streak > 0 ? "#ea580c" : "none"}
            color={profile && profile.streak > 0 ? "#ea580c" : "#a1a1a1"}
          />
          <span className="text-sm font-bold">{profile?.streak || 0} Hard Day</span>
        </div>
        <button 
          onClick={logout}
          className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          Sign out
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="space-y-12 max-w-sm w-full">
          {isCompletedToday ? (
            <div className="mb-24">
                <p className="text-xl text-zinc-500 mb-3">Next challenge in</p>
                <div className="flex justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-light text-zinc-100">{String(countdown.hours).padStart(2, '0')}</span>
                    <span className="text-xs text-zinc-600">hours</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-light text-zinc-100">{String(countdown.minutes).padStart(2, '0')}</span>
                    <span className="text-xs text-zinc-600">minutes</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-light text-zinc-100">{String(countdown.seconds).padStart(2, '0')}</span>
                    <span className="text-xs text-zinc-600">seconds</span>
                  </div>
                </div>
              </div>
          ) : (
            <div className="pt-12 border-t border-zinc-900">
              <button
                onClick={() => router.push('/challenge')}
                className="w-full bg-zinc-100 text-zinc-900 py-3.5 rounded-lg text-sm font-medium hover:bg-white transition-colors cursor-pointer"
              >
                Start Today's Practice
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
