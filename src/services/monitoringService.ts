import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../config/firebase';

export const checkUsage = async (): Promise<void> => {
  console.log("=== Firebase Usage Stats ===");
  
  // Check Firestore document count
  const newsSnapshot = await getDocs(query(collection(db, 'news')));
  const eventsSnapshot = await getDocs(query(collection(db, 'events')));
  
  console.log(`News documents: ${newsSnapshot.size}`);
  console.log(`Events documents: ${eventsSnapshot.size}`);
  console.log("===========================");
};