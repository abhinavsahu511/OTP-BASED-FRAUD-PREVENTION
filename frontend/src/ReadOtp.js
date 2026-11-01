import { db } from './firebaseconfig';
import { collection, doc, getDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

async function readLatestOtp() {
  try {
    const latestDoc = await getDoc(doc(db, 'otpcollector', 'latest'));
    if (latestDoc.exists()) {
      return latestDoc.data().otp;
    }
    const q = query(collection(db, 'otpcollector'), orderBy('timestamp', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map((d) => d.data());
    return docs[0]?.otp || null;
  } catch (err) {
    console.error('Error reading OTP from Firebase:', err);
    return null;
  }
}

export default readLatestOtp;
