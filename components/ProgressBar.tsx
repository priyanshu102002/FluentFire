'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full flex items-center space-x-4">
      <div className="text-xs text-zinc-600 font-mono">
        {current}/{total}
      </div>
      <div className="h-[2px] w-full bg-zinc-900 overflow-hidden">
        <motion.div
          className="h-full bg-zinc-400"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
