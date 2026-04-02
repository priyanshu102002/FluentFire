import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const questionId = request.nextUrl.searchParams.get('questionId');
    const hintLevel = request.nextUrl.searchParams.get('hintLevel');

    if (!questionId || !hintLevel) {
      return NextResponse.json({ error: 'questionId and hintLevel are required' }, { status: 400 });
    }

    // Get the question from database
    const questionDocRef = doc(db, 'questions', questionId);
    const questionDocSnap = await getDoc(questionDocRef);

    if (!questionDocSnap.exists()) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const question = questionDocSnap.data();
    const answer = question.answer;
    const level = parseInt(hintLevel);
    const maxHints = answer.length;
    const capped = Math.min(level, maxHints, 5); // Cap at 5 or answer length

    // Generate hint without revealing the full answer
    const hint = answer.slice(0, capped) + "_".repeat(answer.length - capped);

    return NextResponse.json({ hint });
  } catch (error) {
    console.error('Error fetching hint:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to fetch hint', details: errorMessage }, { status: 500 });
  }
}
