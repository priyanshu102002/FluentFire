'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HintBoxProps {
  answer: string;
  hintLevel: number;
  onGetHint: () => void;
}

export function HintBox({ answer, hintLevel, onGetHint }: HintBoxProps) {
  const getHintString = () => {
    if (hintLevel === 0) return '';
    return answer.slice(0, hintLevel) + "_".repeat(answer.length - hintLevel);
  };

  const maxHints = answer.length;
  const canGetHint = hintLevel < maxHints && hintLevel < 5;

  return (
    <div className="flex flex-col items-center justify-center space-y-3 h-16">
      {canGetHint && hintLevel === 0 && (
        <button
          onClick={onGetHint}
          className="text-xs text-zinc-700 hover:text-zinc-500 transition-colors cursor-pointer"
        >
          Need a hint?
        </button>
      )}
      
      <AnimatePresence mode="wait">
        {hintLevel > 0 && (
          <motion.div
            key={hintLevel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-zinc-500 font-mono text-sm tracking-[0.2em]"
          >
            {getHintString()}
          </motion.div>
        )}
      </AnimatePresence>

      {canGetHint && hintLevel > 0 && (
        <button
          onClick={onGetHint}
          className="text-xs text-zinc-700 hover:text-zinc-500 transition-colors cursor-pointer"
        >
          More hint
        </button>
      )}
    </div>
  );
}
