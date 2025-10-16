/**
 * Simple seed script to create plan documents in Firestore under collection `plans`.
 * Usage:
 *   node seedPlans.js
 * Make sure you have service account credentials or are running inside Firebase admin environment.
 */

const admin = require('firebase-admin');
const path = require('path');

// Allow passing a service-account JSON via --key=/path/to/key.json
// or use the standard GOOGLE_APPLICATION_CREDENTIALS env var.
const keyArg = process.argv.find(a => a.startsWith('--key='));
const keyPath = keyArg ? keyArg.split('=')[1] : process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (keyPath) {
  const resolved = path.resolve(keyPath);
  try {
    const serviceAccount = require(resolved);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log('Initialized admin SDK using key:', resolved);
  } catch (err) {
    console.error('Failed to initialize admin SDK with key at', resolved, err.message);
    process.exit(1);
  }
} else {
  try {
    // When running inside Firebase Functions environment this should work.
    admin.initializeApp();
    console.log('Initialized admin SDK using default application credentials.');
  } catch (e) {
    console.error('\nNo service account key provided and default credentials not available.');
    console.error('Either set GOOGLE_APPLICATION_CREDENTIALS to a service account JSON or run this with --key=/path/key.json');
    console.error('See: https://cloud.google.com/docs/authentication/getting-started\n');
    process.exit(1);
  }
}

const db = admin.firestore();

// Força uso do emulador se variável estiver definida
if (process.env.FIRESTORE_EMULATOR_HOST) {
  db.settings({
    host: process.env.FIRESTORE_EMULATOR_HOST,
    ssl: false
  });
  console.log('Firestore conectado ao emulador:', process.env.FIRESTORE_EMULATOR_HOST);
}

async function seed() {
  // Adicionamos stripePriceId como placeholder; preencha com IDs reais do Stripe se for integrar pagamentos.
  const plans = {
    basic: { title: 'Plano Básico', price: 29.0, interval: 'one-time', description: 'Acesso a módulos limitados', stripePriceId: '' },
    pro: { title: 'Plano Pro', price: 29.0, interval: 'monthly', description: 'Acesso completo a todos os módulos', stripePriceId: 'price_pro_placeholder' },
    elite: { title: 'Plano Elite', price: 199.0, interval: 'yearly', description: 'Acesso anual completo e aulas exclusivas', stripePriceId: 'price_elite_placeholder' }
  };

  for (const id of Object.keys(plans)) {
    console.log('Seeding plan', id);
    await db.collection('plans').doc(id).set(plans[id]);
  }

  console.log('Done seeding plans');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
