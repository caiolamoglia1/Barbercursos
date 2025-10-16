// api/stripe-webhook.js
const initAdmin = require('./_admin');
const Stripe = require('stripe');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const stripeSecret = process.env.STRIPE_SECRET;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecret || !webhookSecret) return res.status(500).send('Stripe secrets not configured');

  const stripe = Stripe(stripeSecret);

  // Vercel provides body as parsed JSON; to verify signature we need raw body.
  // Vercel exposes the raw body via `req.rawBody` when using `@vercel/node` with config.
  const signature = req.headers['stripe-signature'];
  const rawBody = req.rawBody || JSON.stringify(req.body);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err && err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const planId = session.metadata && session.metadata.planId;
    const stripeSubscriptionId = session.subscription;

    if (!userId || !planId) {
      console.error('Missing metadata in session', session.id);
      return res.status(400).send('Missing metadata');
    }

    try {
      const admin = initAdmin();
      const db = admin.firestore();
      const subscriptionRef = db.collection('users').doc(userId).collection('subscriptions').doc(planId);
      await subscriptionRef.set({
        active: true,
        stripeSubscriptionId,
        startedAt: admin.firestore.FieldValue.serverTimestamp(),
        method: 'stripe',
        plan: db.doc(`plans/${planId}`)
      });
      console.log('Activated subscription for', userId, planId);
    } catch (err) {
      console.error('Failed to write subscription:', err && err.message);
      return res.status(500).send('Failed to write subscription');
    }
  }

  res.status(200).send('ok');
};
