// functions/create_session.js
const admin = require('firebase-admin');

(async () => {
  try {
    admin.initializeApp();
    const db = admin.firestore();
    if (process.env.FIRESTORE_EMULATOR_HOST) {
      db.settings({ host: process.env.FIRESTORE_EMULATOR_HOST, ssl: false });
    }

    const planId = 'pro';
    const planDoc = await db.collection('plans').doc(planId).get();
    if (!planDoc.exists) {
      console.error('plan not found');
      process.exit(1);
    }

    const priceId = planDoc.data().stripePriceId;
    if (!priceId) {
      console.error('plan missing stripePriceId');
      process.exit(1);
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/curso-barbearia/planos',
      client_reference_id: 'test-user',
      metadata: { planId }
    });

    console.log(JSON.stringify({ sessionId: session.id, url: session.url }));
    process.exit(0);
  } catch (err) {
    console.error('err', err && (err.message || err));
    process.exit(1);
  }
})();
