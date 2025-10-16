const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
// Mercado Pago integration removed — using manual subscribe endpoint for now

admin.initializeApp();
const db = admin.firestore();
// If running with Firestore emulator, ensure the admin SDK points to it
if (process.env.FIRESTORE_EMULATOR_HOST) {
  try {
    db.settings({ host: process.env.FIRESTORE_EMULATOR_HOST, ssl: false });
    console.log('Functions admin connected to Firestore emulator at', process.env.FIRESTORE_EMULATOR_HOST);
  } catch (e) {
    console.warn('Failed to configure Firestore emulator settings in functions:', e && e.message);
  }
}

// Mercado Pago removed: keep functions working without payment provider

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Manual subscribe endpoint: creates an active subscription record for the user and plan
app.post('/subscribe', async (req, res) => {
  try {
    const uid = req.body.userId || 'test';
    const { planId } = req.body;
    if (!planId) return res.status(400).json({ error: 'planId required' });

    // verify plan exists
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

// Optional Stripe integration endpoints
let stripe;
try {
  // Prefer functions config (for deployed functions), but allow an env var fallback for local testing
  const stripeKey = (functions.config && functions.config().stripe && functions.config().stripe.secret_key) || process.env.STRIPE_SECRET;
  if (stripeKey) {
    stripe = require('stripe')(stripeKey);
  } else {
    // stripe will remain undefined in local setups without config — endpoints will return helpful errors
    console.log('Stripe secret not found in functions.config().stripe.secret_key or process.env.STRIPE_SECRET — /create-checkout-session will be disabled until configured.');
  }
} catch (e) {
  console.warn('Stripe module not available or failed to initialize:', e && e.message);
}

// Create a Checkout Session (expects planId and userId)
app.post('/create-checkout-session', async (req, res) => {
  if (!stripe) return res.status(500).json({ error: 'Stripe not configured on this environment' });

  const { planId, userId } = req.body;
  if (!planId || !userId) return res.status(400).json({ error: 'planId and userId are required' });

  try {
    const planDoc = await db.collection('plans').doc(planId).get();
    if (!planDoc.exists) return res.status(404).json({ error: 'Plan not found' });
    const plan = planDoc.data();
    const priceId = plan.stripePriceId;
    if (!priceId) return res.status(400).json({ error: 'Plan missing stripePriceId' });

    const successUrl = 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}';
    const cancelUrl = 'http://localhost:5173/curso-barbearia/planos';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: { planId }
    });

  // Return sessionId and URL (newer Stripe SDK returns session.url)
  return res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('create-checkout-session error', err);
    return res.status(500).json({ error: err.message || err.toString() });
  }
});

// Stripe webhook endpoint — expects the raw body
app.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) return res.status(500).send('Stripe not configured');

  const signature = req.headers['stripe-signature'];
  const webhookSecret = functions.config().stripe && functions.config().stripe.webhook_secret;
  if (!webhookSecret) {
    console.warn('Stripe webhook secret not configured in functions.config().stripe.webhook_secret');
    return res.status(500).send('Webhook secret not configured');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err && err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const planId = session.metadata && session.metadata.planId;
    const stripeSubscriptionId = session.subscription;

    if (!userId || !planId) {
      console.error('Missing userId or planId in session metadata');
      return res.status(400).send('Missing metadata');
    }

    try {
      const subscriptionRef = db.collection('users').doc(userId).collection('subscriptions').doc(planId);
      await subscriptionRef.set({
        active: true,
        stripeSubscriptionId: stripeSubscriptionId,
        startedAt: admin.firestore.FieldValue.serverTimestamp(),
        method: 'stripe',
        plan: db.doc(`plans/${planId}`)
      });

      console.log(`Activated subscription for user ${userId} plan ${planId}`);
    } catch (err) {
      console.error('Failed to write subscription to Firestore:', err);
      return res.status(500).send('Failed to write subscription');
    }
  }

  res.status(200).send('ok');
});

// Webhook endpoint for Mercado Pago notifications
// Payment webhooks removed — no external payment provider configured

exports.api = functions.https.onRequest(app);
