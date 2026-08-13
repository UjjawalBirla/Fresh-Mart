import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// =========================================
// FIREBASE APP
// =========================================

const app = initializeApp(firebaseConfig);

// =========================================
// FIREBASE AUTH
// =========================================

export const auth = getAuth(app);

// =========================================
// FIRESTORE
// =========================================

export const db = getFirestore(app);

// =========================================
// DEFAULT APP
// =========================================

export default app;
