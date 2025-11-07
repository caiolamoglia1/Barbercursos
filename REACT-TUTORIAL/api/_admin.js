// api/_admin.js
// Inicializa firebase-admin de forma idempotente.
// Em Vercel, passe a chave do service account via env FIREBASE_SERVICE_ACCOUNT (JSON string)

import admin from 'firebase-admin';

export default function initAdmin() {
  if (admin.apps && admin.apps.length) return admin;

  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (saJson) {
    try {
      const sa = JSON.parse(saJson);
      admin.initializeApp({ credential: admin.credential.cert(sa) });
      console.log('Initialized admin SDK from FIREBASE_SERVICE_ACCOUNT');
    } catch (err) {
      console.error('Failed parsing FIREBASE_SERVICE_ACCOUNT:', err && err.message);
      throw err;
    }
  } else {
    // fallback to default application credentials (if provided by env in hosting)
    admin.initializeApp();
    console.log('Initialized admin SDK using default credentials');
  }

  return admin;
}
