"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/lib/user-client";
import { motion } from "framer-motion";
import { Flame, User } from "lucide-react";
import type { UserProfile } from "@/app/api/user/route";

export default function CountdownPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      try {        // Add small delay to ensure Firestore update from challenge page completes
        await new Promise(resolve => setTimeout(resolve, 500));
                const userProfile = await getUserProfile(user.uid);
        setProfile(userProfile);
      } catch (error) {
        console.error("Error loading profile", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown({ hours, minutes, seconds });
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false);
    };

    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isDropdownOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-zinc-700 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-8 flex items-center justify-between max-w-4xl mx-auto w-full">
        <div className="flex items-center space-x-2 text-zinc-400 w-24">
          <Flame
            className="w-4 h-4 text-orange-500/80"
            fill="oklch(70.5% 0.213 47.604)"
          />
          <span className="text-sm font-medium">{profile?.streak || 0}</span>
        </div>
        <div className="flex-1"></div>
        <div className="w-24 flex justify-end relative">
          {user && (
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full border border-white/20 hover:border-white/40 transition-colors overflow-hidden cursor-pointer flex items-center justify-center bg-white/10 text-white font-semibold text-sm"
              >
                <User />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-8 right-0 bg-black/90 border border-white/20 rounded-md shadow-lg z-10">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors text-left whitespace-nowrap"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12 max-w-sm w-full text-center"
        >
          {/* Celebration Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-light text-zinc-100">Well done.</h2>
            <p className="text-sm text-zinc-500">
              You've completed today's practice.
            </p>
          </div>

          {/* Streak Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Flame
                className="w-5 h-5 text-orange-500"
                fill="oklch(70.5% 0.213 47.604)"
              />
              <span className="text-4xl font-light text-zinc-100">
                {profile?.streak || 0}
              </span>
            </div>
            <p className="text-xs text-zinc-600">hard streak</p>
          </div>

          {/* Countdown Section */}
          <div className="space-y-4">
            <p className="text-sm text-zinc-500 mb-6">Next challenge in</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-zinc-900 rounded-lg p-4">
                <div className="text-3xl font-light text-zinc-100">
                  {String(countdown.hours).padStart(2, "0")}
                </div>
                <div className="text-xs text-zinc-600 mt-1">hours</div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-4">
                <div className="text-3xl font-light text-zinc-100">
                  {String(countdown.minutes).padStart(2, "0")}
                </div>
                <div className="text-xs text-zinc-600 mt-1">minutes</div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-4">
                <div className="text-3xl font-light text-zinc-100">
                  {String(countdown.seconds).padStart(2, "0")}
                </div>
                <div className="text-xs text-zinc-600 mt-1">seconds</div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
