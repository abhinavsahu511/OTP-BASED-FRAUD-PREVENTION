import { db } from './firebaseconfig';
import { collection, doc, getDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

async function readLatestData() {
  try {
    const latestDoc = await getDoc(doc(db, 'locations', 'latest'));
    if (latestDoc.exists()) {
      return latestDoc.data();
    }
    const q = query(collection(db, 'locations'), orderBy('timestamp', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map((d) => d.data());
    return docs[0] || null;
  } catch (err) {
    console.error('Error reading location from Firebase:', err);
    return null;
  }
}

export default readLatestData;
