const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize admin SDK
try {
  admin.initializeApp();
} catch (e) {
  // ignore if already initialized in other contexts
}
const db = admin.firestore();

// If running with Firestore emulator, point admin SDK to it
if (process.env.FIRESTORE_EMULATOR_HOST) {
  db.settings({ host: process.env.FIRESTORE_EMULATOR_HOST, ssl: false });
  console.log('Local server connected to Firestore emulator at', process.env.FIRESTORE_EMULATOR_HOST);
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true, message: 'local functions server' }));

app.post('/subscribe', async (req, res) => {
  try {
    const uid = req.body.userId || 'test';
    const { planId } = req.body;
    if (!planId) return res.status(400).json({ error: 'planId required' });

    const planDoc = await db.collection('plans').doc(planId).get();
    if (!planDoc.exists) return res.status(404).json({ error: 'Plan not found' });

    const subRef = db.collection('users').doc(uid).collection('subscriptions').doc(planId);
    await subRef.set({
      active: true,
      startedAt: admin.firestore.FieldValue.serverTimestamp(),
      method: 'manual'
    });

    return res.json({ success: true, planId, userId: uid });
  } catch (err) {
    console.error('subscribe error', err);
    return res.status(500).json({ error: err.toString() });
  }
});

// TEST ONLY: simulate a Stripe checkout.session.completed webhook locally
// Body: { client_reference_id: <userId>, metadata: { planId }, subscription: <stripeSubscriptionId> }
app.post('/simulate-stripe-webhook', async (req, res) => {
  try {
    const { client_reference_id: userId, metadata, subscription } = req.body;
    const planId = metadata && metadata.planId;
    if (!userId || !planId) return res.status(400).json({ error: 'userId and planId required in body' });

    const subscriptionRef = db.collection('users').doc(userId).collection('subscriptions').doc(planId);
    await subscriptionRef.set({
      active: true,
      stripeSubscriptionId: subscription || `sub_test_${Date.now()}`,
      startedAt: admin.firestore.FieldValue.serverTimestamp(),
      method: 'stripe',
      plan: db.doc(`plans/${planId}`),
    });

    return res.json({ success: true, userId, planId });
  } catch (err) {
    console.error('simulate-stripe-webhook error', err);
    return res.status(500).json({ error: err.toString() });
  }
});

// Minimal create-checkout-session endpoint to support local dev via Vite proxy.
// Mirrors the logic in functions/index.js but uses process.env.STRIPE_SECRET for local testing.
app.post('/platcursomaicon/us-central1/api/create-checkout-session', async (req, res) => {
  try {
    console.log('local create-checkout-session called with body:', req.body);
    const stripeSecret = process.env.STRIPE_SECRET;
    if (!stripeSecret) {
      console.error('Stripe secret not configured in env');
      return res.status(500).json({ error: 'Stripe secret not configured in env' });
    }

    const { planId, userId } = req.body;
    if (!planId || !userId) return res.status(400).json({ error: 'planId and userId are required' });

    const planDoc = await db.collection('plans').doc(planId).get();
    if (!planDoc.exists) return res.status(404).json({ error: 'Plan not found' });
    const plan = planDoc.data();
    const priceId = plan.stripePriceId;
    if (!priceId) return res.status(400).json({ error: 'Plan missing stripePriceId' });

    const Stripe = require('stripe');
    const stripe = Stripe(stripeSecret);

    const successUrl = 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}';
    const cancelUrl = 'http://localhost:5173/curso-barbearia/planos';

    console.log('About to call stripe.checkout.sessions.create with priceId:', priceId);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: { planId }
    });
    console.log('Stripe returned session id:', session && session.id);

    return res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('local create-checkout-session error', err && (err.message || err));
    return res.status(500).json({ error: err && (err.message || err.toString()) });
  }
});

const port = process.env.LOCAL_FUNCTIONS_PORT || 5001;
app.listen(port, () => console.log(`Local functions server listening on http://127.0.0.1:${port}`));
