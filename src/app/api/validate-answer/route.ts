import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, userAnswer, userId, currentIndex, isFinished } = body;

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

    // If correct and userId provided, update progress and solved questions
    if (isCorrect && userId && currentIndex !== undefined && isFinished !== undefined) {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const progressId = `${userId}_${todayStr}`;
        const progressDocRef = doc(db, 'daily_progress', progressId);
        
        // Update progress
        await updateDoc(progressDocRef, {
          currentQuestionIndex: currentIndex,
          completed: isFinished,
        });

        // Add to solved questions
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const solvedQuestions = userData.solvedQuestions || [];
          
          if (!solvedQuestions.includes(questionId)) {
            await updateDoc(userDocRef, {
              solvedQuestions: arrayUnion(questionId),
            });
          }
        }
      } catch (progressError) {
        console.error('Error updating progress:', progressError);
        // Still return correct even if progress update fails
      }
    }

    return NextResponse.json({ 
      correct: isCorrect,
    });
  } catch (error) {
    console.error('Error validating answer:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to validate answer', details: errorMessage }, { status: 500 });
  }
}
