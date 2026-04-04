"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getDailyQuestionsFromAPI, Question } from "@/lib/questions-client";
import {
  getDailyProgress,
  initializeDailyProgress,
} from "@/lib/progress-client";
import {
  getUserProfile,
  updateUserStreak,
  createUserProfile,
} from "@/lib/user-client";
import { QuestionCard } from "@/components/QuestionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import type { UserProfile } from "@/app/api/user/route";

export default function ChallengePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  console.log("iser", user)

  useEffect(() => {
    async function initChallenge() {
      if (!user) return;

      try {
        let userProfile = await getUserProfile(user.uid);

        // Create profile if it doesn't exist
        if (!userProfile) {
          await createUserProfile(user.uid, user.email || "");
          userProfile = await getUserProfile(user.uid);
        }

        setProfile(userProfile);

        const dailyQuestions = await getDailyQuestionsFromAPI(user.uid);
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

  useEffect(() => {
    if (completed) {
      router.push("/countdown");
    }
  }, [completed, router]);

  const handleCorrectAnswer = async () => {
    if (!user) return;

    const nextIndex = currentIndex + 1;
    const isFinished = nextIndex >= questions.length;

    try {
      // Progress is already updated by validate-answer endpoint
      // Just handle the completion flow
      if (isFinished) {
        await updateUserStreak(user.uid, true);
        setCompleted(true);
      } else {
        setCurrentIndex(nextIndex);
      }
    } catch (error) {
      console.error("Error updating challenge state", error);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-zinc-700 animate-pulse"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-8 flex items-center justify-between max-w-4xl mx-auto w-full">
        <div className="flex items-center space-x-2 text-zinc-400 w-24">
          <Flame className="w-4 h-4 text-orange-500/80" />
          <span className="text-sm font-medium">{profile?.streak || 0} Day</span>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xs">
            <ProgressBar current={currentIndex + 1} total={questions.length} />
          </div>
        </div>
        <div className="w-24 flex justify-end">
          {user?.photoURL && (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User avatar'}
              className="w-6 h-6 rounded-full"
            />
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            onCorrect={handleCorrectAnswer}
            userId={user?.uid}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
          />
        )}
      </main>
    </div>
  );
}
