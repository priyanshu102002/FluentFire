import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';

export interface DailyProgress {
  userId: string;
  date: string;
  currentQuestionIndex: number;
  completed: boolean;
  solvedQuestionIds?: string[];
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const progressId = `${userId}_${todayStr}`;
    const docRef = doc(db, 'daily_progress', progressId);
    
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data());
    }
    
    return NextResponse.json(null);
  } catch (error) {
    console.error('Error fetching daily progress:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to fetch daily progress', details: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const progressId = `${userId}_${todayStr}`;
    const docRef = doc(db, 'daily_progress', progressId);
    
    const newProgress: DailyProgress = {
      userId,
      date: todayStr,
      currentQuestionIndex: 0,
      completed: false,
    };
    
    await setDoc(docRef, newProgress);
    return NextResponse.json(newProgress);
  } catch (error) {
    console.error('Error initializing daily progress:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to initialize daily progress', details: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, currentQuestionIndex, completed, questionId } = body;

    if (!userId || currentQuestionIndex === undefined || completed === undefined) {
      return NextResponse.json({ error: 'userId, currentQuestionIndex, and completed are required' }, { status: 400 });
    }

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const progressId = `${userId}_${todayStr}`;
    const progressDocRef = doc(db, 'daily_progress', progressId);
    
    await updateDoc(progressDocRef, {
      currentQuestionIndex,
      completed,
    });

    // If questionId is provided, add it to the user's solved questions
    if (questionId) {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const solvedQuestions = userData.solvedQuestions || [];
        
        // Only add if not already solved
        if (!solvedQuestions.includes(questionId)) {
          await updateDoc(userDocRef, {
            solvedQuestions: arrayUnion(questionId),
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating progress:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to update progress', details: errorMessage }, { status: 500 });
  }
}
