/**
 * Server-side database utilities for Firestore operations
 */

import { doc, getDoc, setDoc, updateDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function getDocument(collection: string, docId: string): Promise<DocumentData | null> {
  try {
    const docRef = doc(db, collection, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    throw new Error(`Failed to get document from ${collection}: ${error}`);
  }
}

export async function createDocument(
  collection: string,
  docId: string,
  data: DocumentData
): Promise<void> {
  try {
    const docRef = doc(db, collection, docId);
    await setDoc(docRef, data);
  } catch (error) {
    throw new Error(`Failed to create document in ${collection}: ${error}`);
  }
}

export async function updateDocument(
  collection: string,
  docId: string,
  data: DocumentData
): Promise<void> {
  try {
    const docRef = doc(db, collection, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    throw new Error(`Failed to update document in ${collection}: ${error}`);
  }
}
