import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase конфігурація
const firebaseConfig = {
  apiKey: "AIzaSyBzyip_DM6rFNr4tzUW8IqIb_86_rYMOA",
  authDomain: "wishlist-9c234.firebaseapp.com",
  projectId: "wishlist-9c234",
  storageBucket: "wishlist-9c234.firebasestorage.app",
  messagingSenderId: "536503909954",
  appId: "1:536503909954:web:f5d7cfde19f699139837db",
  measurementId: "G-6QW91KG2M5"
};

// Ініціалізуємо Firebase
const app = initializeApp(firebaseConfig);

// Експортуємо необхідні сервіси
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
