import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9asThRaQb84Hp0eLL1KmESxaOVBh7AUM",

  authDomain: "freshmart-edef5.firebaseapp.com",

  projectId: "freshmart-edef5",

  storageBucket: "freshmart-edef5.firebasestorage.app",

  messagingSenderId: "512605655081",

  appId: "1:512605655081:web:875599173a44b397384c38",

  measurementId: "G-M1ZDG56VXH",
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
