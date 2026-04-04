export interface Question {
  id: string;
  sentence: string;
  answerLength: number;
}

export const getDailyQuestionsFromAPI = async (userId: string): Promise<Question[]> => {
  try {
    const response = await fetch(`/api/questions?userId=${userId}`, {
      // Cache the response for 5 seconds to avoid redundant fetches
      next: { revalidate: 5 }
    });
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
