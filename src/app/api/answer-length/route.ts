import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const questionId = request.nextUrl.searchParams.get('questionId');

    if (!questionId) {
      return NextResponse.json({ error: 'questionId is required' }, { status: 400 });
    }

    // Get the question from database
    const questionDocRef = doc(db, 'questions', questionId);
    const questionDocSnap = await getDoc(questionDocRef);

    if (!questionDocSnap.exists()) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const question = questionDocSnap.data();
    const answerLength = question.answer.length;

    return NextResponse.json({ length: answerLength });
  } catch (error) {
    console.error('Error fetching answer length:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to fetch answer length', details: errorMessage }, { status: 500 });
  }
}
