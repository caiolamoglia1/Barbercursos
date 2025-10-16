const admin = require('firebase-admin');
const path = require('path');

// Accept --key=/path/to/key.json or use GOOGLE_APPLICATION_CREDENTIALS
const keyArg = process.argv.find(a => a.startsWith('--key='));
const keyPath = keyArg ? keyArg.split('=')[1] : process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (keyPath) {
  const resolved = path.resolve(keyPath);
  const serviceAccount = require(resolved);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  console.log('Initialized admin SDK using key:', resolved);
} else {
  admin.initializeApp();
  console.log('Initialized admin SDK with default credentials');
}

const db = admin.firestore();
if (process.env.FIRESTORE_EMULATOR_HOST) {
  db.settings({ host: process.env.FIRESTORE_EMULATOR_HOST, ssl: false });
  console.log('Connected to Firestore emulator at', process.env.FIRESTORE_EMULATOR_HOST);
}

(async () => {
  try {
    const snap = await db.collection('plans').get();
    if (snap.empty) {
      console.log('No plans found');
      process.exit(0);
    }
    snap.forEach(doc => {
      console.log(doc.id, JSON.stringify(doc.data(), null, 2));
    });
    process.exit(0);
  } catch (err) {
    console.error('readPlans error', err);
    process.exit(1);
  }
})();
