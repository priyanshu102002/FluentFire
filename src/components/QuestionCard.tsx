'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HintBox } from './HintBox';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: {
    id: string;
    sentence: string;
    answerLength: number;
  };
  onCorrect: () => void;
  userId?: string;
  currentIndex?: number;
  totalQuestions?: number;
}

export function QuestionCard({ question, onCorrect, userId, currentIndex = 0, totalQuestions = 0 }: QuestionCardProps) {
  const [input, setInput] = useState('');
  const [hintLevel, setHintLevel] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect' | 'checking'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const answerLength = question.answerLength;

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
      setHintLevel(prev => Math.min(prev + 1, 5));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === 'checking') return;

    setStatus('checking');

    try {
      const nextIndex = currentIndex + 1;
      const isFinished = nextIndex >= totalQuestions;

      // Validate answer on backend and update progress in one call
      const response = await fetch('/api/validate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: question.id,
          userAnswer: input.trim(),
          userId,
          currentIndex: nextIndex,
          isFinished,
        }),
      });

      const data = await response.json();

      if (data.correct) {
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
    } catch (error) {
      console.error('Error validating answer:', error);
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
        <div className="relative w-full max-w-xs flex justify-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, answerLength))}
            onKeyDown={handleKeyDown}
            disabled={status === 'correct' || status === 'checking'}
            maxLength={answerLength}
            className="absolute opacity-0 w-0 h-0"
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
          
          <div className="flex gap-2 justify-center">
            {Array.from({ length: answerLength }).map((_, index) => (
              <div
                key={index}
                onClick={() => inputRef.current?.focus()}
                className={`w-10 h-12 flex items-center justify-center border-2 rounded-md text-lg font-semibold transition-all cursor-text
                  ${status === 'correct' ? 'border-green-500 bg-green-500/10 text-green-400' : ''}
                  ${status === 'incorrect' ? 'border-red-500 bg-red-500/10 text-red-400' : ''}
                  ${status === 'idle' && index < input.length ? 'border-zinc-500 bg-zinc-900/50 text-zinc-100' : ''}
                  ${status === 'idle' && index >= input.length ? 'border-zinc-700 bg-zinc-950' : ''}
                  ${status === 'checking' ? 'border-zinc-600 bg-zinc-900/30 text-zinc-400' : ''}
                `}
              >
                {input[index] ? input[index].toUpperCase() : ''}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'correct' || !input.trim() || status === 'checking'}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-0 cursor-pointer"
        >
          {status === 'checking' ? 'Checking...' : 'Submit ↵'}
        </button>

        <HintBox 
          questionId={question.id}
          hintLevel={hintLevel}
          onGetHint={() => setHintLevel(prev => Math.min(prev + 1, 5))}
        />
      </form>
    </motion.div>
  );
}
