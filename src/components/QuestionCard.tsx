'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Question } from '@/lib/questions';
import { HintBox } from './HintBox';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: Question;
  onCorrect: () => void;
}

export function QuestionCard({ question, onCorrect }: QuestionCardProps) {
  const [input, setInput] = useState('');
  const [hintLevel, setHintLevel] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInput('');
    setHintLevel(0);
    setStatus('idle');
  }, [question.id]);

  useEffect(() => {
    if (status === 'idle') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [status, question.id]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
      e.preventDefault();
      setHintLevel(prev => prev + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const isCorrect = input.trim().toLowerCase() === question.answer.toLowerCase();
    
    if (isCorrect) {
      setStatus('correct');
      setTimeout(() => {
        onCorrect();
      }, 1000);
    } else {
      setStatus('incorrect');
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    }
  };

  const parts = question.sentence.split('___');

  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(4px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(4px)' }}
      className="w-full max-w-lg mx-auto space-y-16"
    >
      <div className="text-xl md:text-2xl font-light text-zinc-200 leading-relaxed text-center">
        {parts[0]}
        <span className="inline-block mx-2 border-b border-zinc-700 w-16 md:w-24 translate-y-1"></span>
        {parts[1]}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-10">
        <div className="relative w-full max-w-xs">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={status === 'correct'}
            placeholder="Type your answer"
            className={`w-full bg-transparent border-b-2 px-0 py-3 outline-none transition-all text-center text-xl font-medium placeholder:text-zinc-800
              ${status === 'idle' ? 'border-zinc-800 text-zinc-100 focus:border-zinc-500' : ''}
              ${status === 'correct' ? 'border-green-500 text-green-400' : ''}
              ${status === 'incorrect' ? 'border-red-500 text-red-400' : ''}
            `}
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'correct' || !input.trim()}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-0 cursor-pointer"
        >
          Submit ↵
        </button>

        <HintBox 
          answer={question.answer} 
          hintLevel={hintLevel}
          onGetHint={() => setHintLevel(prev => prev + 1)}
        />
      </form>
    </motion.div>
  );
}
