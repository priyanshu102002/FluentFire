import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getSeededQuestions } from '@/server/questions';

export async function POST(request: NextRequest) {
  try {
    // Check if questions already exist
    const questionsRef = collection(db, 'questions');
    const snapshot = await getDocs(questionsRef);
    
    if (snapshot.size > 0) {
      return NextResponse.json({ message: 'Questions already seeded', count: snapshot.size });
    }

    // Seed questions into Firestore
    const seededQuestions = getSeededQuestions();
    
    for (const question of seededQuestions) {
      const docRef = doc(db, 'questions', question.id);
      await setDoc(docRef, question);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Questions seeded successfully', 
      count: seededQuestions.length 
    });
  } catch (error) {
    console.error('Error seeding questions:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to seed questions', details: errorMessage }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const questionsRef = collection(db, 'questions');
    const snapshot = await getDocs(questionsRef);
    
    return NextResponse.json({ 
      count: snapshot.size,
      seeded: snapshot.size > 0
    });
  } catch (error) {
    console.error('Error checking questions:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to check questions', details: errorMessage }, { status: 500 });
  }
}
