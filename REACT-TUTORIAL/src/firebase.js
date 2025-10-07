// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPnbugFRNqsZQbgP5Giyr_a-Uw_3BPe5w",
  authDomain: "platcursomaicon.firebaseapp.com",
  projectId: "platcursomaicon",
  storageBucket: "platcursomaicon.firebasestorage.app",
  messagingSenderId: "426777851049",
  appId: "1:426777851049:web:677516c36e8b63d5aa25b8",
  measurementId: "G-XEH7RD0YZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

// Enable offline persistence (optional - helps with offline mode)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Múltiplas abas abertas, persistência desabilitada');
  } else if (err.code === 'unimplemented') {
    console.warn('Navegador não suporta persistência offline');
  }
});

export default app;