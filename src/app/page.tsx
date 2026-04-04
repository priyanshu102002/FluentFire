"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      try {
        if (user) {
          router.push("/challenge");
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Navigation error:", err);
        setError("Failed to navigate. Please try refreshing the page.");
      }
    }
  }, [user, loading, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-2 h-2 rounded-full bg-zinc-700 animate-pulse mb-4"></div>
        <p className="text-zinc-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}
