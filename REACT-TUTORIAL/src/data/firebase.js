// src/modules/go-academy/data/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDkHwiQjypYwV2MV4c0t4nbieirb6iydjg",
  authDomain: "go-academy-4cf50.firebaseapp.com",
  projectId: "go-academy-4cf50",
  storageBucket: "go-academy-4cf50.firebasestorage.app",
  messagingSenderId: "1027522076413",
  appId: "1:1027522076413:web:45d3cab0f160c6c4a92894",
  measurementId: "G-RDJSR6P5P2"
};

// Initialize Firebase for Treinamentos module com um nome específico
// Isso permite ter múltiplas instâncias do Firebase na mesma aplicação
let app;
try {
  app = getApp('treinamentos'); // Tenta pegar o app com nome 'treinamentos'
} catch (error) {
  app = initializeApp(firebaseConfig, 'treinamentos'); // Se não existe, cria com esse nome
}

// Initialize Firestore and Auth for Treinamentos
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
