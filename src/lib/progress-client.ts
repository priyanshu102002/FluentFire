import { DailyProgress } from '@/app/api/progress/route';

export const getDailyProgress = async (userId: string): Promise<DailyProgress | null> => {
  try {
    const response = await fetch(`/api/progress?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch daily progress');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching daily progress:', error);
    return null;
  }
};

export const initializeDailyProgress = async (userId: string): Promise<DailyProgress> => {
  try {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to initialize daily progress');
    }
    return await response.json();
  } catch (error) {
    console.error('Error initializing daily progress:', error);
    throw error;
  }
};

export const updateProgress = async (userId: string, currentQuestionIndex: number, completed: boolean, questionId?: string): Promise<void> => {
  try {
    const response = await fetch('/api/progress', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, currentQuestionIndex, completed, questionId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update progress');
    }
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};
