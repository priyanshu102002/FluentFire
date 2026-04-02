import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, userAnswer } = body;

    if (!questionId || !userAnswer) {
      return NextResponse.json({ error: 'questionId and userAnswer are required' }, { status: 400 });
    }

    // Get the question from database
    const questionDocRef = doc(db, 'questions', questionId);
    const questionDocSnap = await getDoc(questionDocRef);

    if (!questionDocSnap.exists()) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const question = questionDocSnap.data();
    
    // Compare answers (case-insensitive, trimmed)
    const isCorrect = userAnswer.trim().toLowerCase() === question.answer.toLowerCase();

    return NextResponse.json({ 
      correct: isCorrect,
      // Don't send the answer back to the client
    });
  } catch (error) {
    console.error('Error validating answer:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to validate answer', details: errorMessage }, { status: 500 });
  }
}
