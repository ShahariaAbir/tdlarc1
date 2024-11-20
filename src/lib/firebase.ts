import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCK46_VU17SU92I5sUAokMAvPzMAkzraj0",
  authDomain: "tdlarc-b8637.firebaseapp.com",
  projectId: "tdlarc-b8637",
  storageBucket: "tdlarc-b8637.firebasestorage.app",
  messagingSenderId: "1063920024972",
  appId: "1:1063920024972:web:1f9a093a1bd29fee212aa9",
  measurementId: "G-6EZR9WJXVG"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable persistent authentication
setPersistence(auth, browserLocalPersistence);