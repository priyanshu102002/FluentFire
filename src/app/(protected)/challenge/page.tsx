'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getDailyQuestions, Question } from '@/lib/questions';
import { getDailyProgress, initializeDailyProgress, updateProgress } from '@/lib/progress-client';
import { getUserProfile, updateUserStreak } from '@/lib/user-client';
import { QuestionCard } from '@/components/QuestionCard';
import { ProgressBar } from '@/components/ProgressBar';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import type { UserProfile } from '@/app/api/user/route';

export default function ChallengePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function initChallenge() {
      if (!user) return;
      
      try {
        const userProfile = await getUserProfile(user.uid);
        setProfile(userProfile);

        const dailyQuestions = getDailyQuestions();
        setQuestions(dailyQuestions);

        let progress = await getDailyProgress(user.uid);
        if (!progress) {
          progress = await initializeDailyProgress(user.uid);
        }

        if (progress.completed) {
          setCompleted(true);
        } else {
          setCurrentIndex(progress.currentQuestionIndex);
        }
      } catch (error) {
        console.error("Error initializing challenge", error);
      } finally {
        setLoading(false);
      }
    }

    initChallenge();
  }, [user]);

  const handleCorrectAnswer = async () => {
    if (!user) return;

    const nextIndex = currentIndex + 1;
    const isFinished = nextIndex >= questions.length;

    try {
      await updateProgress(user.uid, nextIndex, isFinished);
      
      if (isFinished) {
        await updateUserStreak(user.uid, true);
        setCompleted(true);
      } else {
        setCurrentIndex(nextIndex);
      }
    } catch (error) {
      console.error("Error updating progress", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-zinc-700 animate-pulse"></div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 max-w-sm w-full"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-light text-zinc-100">Well done.</h2>
            <p className="text-sm text-zinc-500">You've completed today's practice.</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-zinc-100 text-zinc-900 py-3.5 rounded-lg text-sm font-medium hover:bg-white transition-colors"
          >
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-8 flex items-center justify-between max-w-4xl mx-auto w-full">
        <div className="flex items-center space-x-2 text-zinc-400 w-24">
          <Flame className="w-4 h-4 text-orange-500/80" />
          <span className="text-sm font-medium">{profile?.streak || 0}</span>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xs">
            <ProgressBar current={currentIndex + 1} total={questions.length} />
          </div>
        </div>
        <div className="w-24 flex justify-end">
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        {currentQuestion && (
          <QuestionCard 
            question={currentQuestion} 
            onCorrect={handleCorrectAnswer} 
          />
        )}
      </main>
    </div>
  );
}
