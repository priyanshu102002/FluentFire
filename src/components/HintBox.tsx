'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HintBoxProps {
  questionId: string;
  hintLevel: number;
  onGetHint: () => void;
}

export function HintBox({ questionId, hintLevel, onGetHint }: HintBoxProps) {
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);

  const maxHints = 5; // Maximum hint level
  const canGetHint = hintLevel < maxHints;

  const handleGetHint = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/hint?questionId=${questionId}&hintLevel=${hintLevel + 1}`);
      const data = await response.json();
      if (data.hint) {
        setHint(data.hint);
        onGetHint();
      }
    } catch (error) {
      console.error('Error fetching hint:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3 h-16">
      {canGetHint && hintLevel === 0 && (
        <button
          onClick={handleGetHint}
          disabled={loading}
          className="text-xs text-zinc-700 hover:text-zinc-500 transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Need a hint?'}
        </button>
      )}
      
      <AnimatePresence mode="wait">
        {hintLevel > 0 && hint && (
          <motion.div
            key={hintLevel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-zinc-500 font-mono text-sm tracking-[0.2em]"
          >
            {hint}
          </motion.div>
        )}
      </AnimatePresence>

      {canGetHint && hintLevel > 0 && (
        <button
          onClick={handleGetHint}
          disabled={loading}
          className="text-xs text-zinc-700 hover:text-zinc-500 transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'More hint'}
        </button>
      )}
    </div>
  );
}
