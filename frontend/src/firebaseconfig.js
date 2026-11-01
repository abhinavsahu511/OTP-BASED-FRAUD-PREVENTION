import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD35zgeq15DOEOgW0mUkbhWqlDegtFWhEg",
  authDomain: "otp-based-fraud.firebaseapp.com",
  projectId: "otp-based-fraud",
  storageBucket: "otp-based-fraud.firebasestorage.app",
  messagingSenderId: "759026524735",
  appId: "1:759026524735:web:1c2f76a3ca636b9c4a8e8a",
  measurementId: "G-9X61LETXQ8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

