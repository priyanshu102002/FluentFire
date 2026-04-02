export interface Question {
  id: string;
  sentence: string;
  answer: string;
}

export const getDailyQuestionsFromAPI = async (userId: string): Promise<Question[]> => {
  try {
    const response = await fetch(`/api/questions?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch daily questions');
    }
    const data = await response.json();
    return data.questions;
  } catch (error) {
    console.error('Error fetching daily questions:', error);
    return [];
  }
};
