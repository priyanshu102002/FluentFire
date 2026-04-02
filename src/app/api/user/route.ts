import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format, subDays } from 'date-fns';

export interface UserProfile {
  email: string;
  streak: number;
  lastCompletedDate?: string;
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data());
    }
    
    return NextResponse.json(null);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to fetch user profile', details: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: 'userId and email are required' }, { status: 400 });
    }

    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, {
      email,
      streak: 0,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating user profile:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to create user profile', details: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, completedAll } = body;

    if (!userId || completedAll === undefined) {
      return NextResponse.json({ error: 'userId and completedAll are required' }, { status: 400 });
    }

    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = docSnap.data() as UserProfile;
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    if (!completedAll) {
      return NextResponse.json({ success: true });
    }

    if (profile.lastCompletedDate === todayStr) {
      return NextResponse.json({ success: true });
    }

    let newStreak = profile.streak;
    const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');

    if (profile.lastCompletedDate === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    await updateDoc(docRef, {
      streak: newStreak,
      lastCompletedDate: todayStr,
    });

    return NextResponse.json({ success: true, streak: newStreak });
  } catch (error) {
    console.error('Error updating user streak:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to update user streak', details: errorMessage }, { status: 500 });
  }
}
