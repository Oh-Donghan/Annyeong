import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBULfiqugX3qsCIXfyy23T3riRjWiIwUMs",
  authDomain: "safe-travel-planning.firebaseapp.com",
  projectId: "safe-travel-planning",
  storageBucket: "safe-travel-planning.appspot.com",
  messagingSenderId: "296304583480",
  appId: "1:296304583480:web:83f6c0e372daeea43b97cd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);