import { NextRequest, NextResponse } from 'next/server';
import { getDailyQuestionsFromDb } from '@/server/questions';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface QuestionResponse {
  id: string;
  sentence: string;
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Get solved questions for this user
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    
    const solvedQuestionIds: string[] = userDocSnap.exists() && userDocSnap.data().solvedQuestions 
      ? userDocSnap.data().solvedQuestions 
      : [];

    // Get daily questions from database excluding solved ones
    const questions = await getDailyQuestionsFromDb(solvedQuestionIds);
    
    // Remove answers from response - only send id and sentence
    const questionsWithoutAnswers: QuestionResponse[] = questions.map(q => ({
      id: q.id,
      sentence: q.sentence
    }));
    
    return NextResponse.json({ questions: questionsWithoutAnswers, solvedCount: solvedQuestionIds.length });
  } catch (error) {
    console.error('Error fetching questions:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to fetch questions', details: errorMessage }, { status: 500 });
  }
}
