// api/create-checkout-session.js
const initAdmin = require('./_admin');
const Stripe = require('stripe');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const admin = initAdmin();
    const db = admin.firestore();

    const stripeSecret = process.env.STRIPE_SECRET;
    if (!stripeSecret) return res.status(500).json({ error: 'Stripe secret not configured' });
    const stripe = Stripe(stripeSecret);

    const { planId, userId } = req.body || {};
    if (!planId || !userId) return res.status(400).json({ error: 'planId and userId required' });

    const planDoc = await db.collection('plans').doc(planId).get();
    if (!planDoc.exists) return res.status(404).json({ error: 'Plan not found' });
    const priceId = planDoc.data().stripePriceId;
    if (!priceId) return res.status(400).json({ error: 'Plan missing stripePriceId' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: process.env.SUCCESS_URL || 'https://your-site/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: process.env.CANCEL_URL || 'https://your-site/planos',
      client_reference_id: userId,
      metadata: { planId }
    });

    return res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('create-checkout-session error', err && (err.stack || err.message || err));
    return res.status(500).json({ error: err.message || String(err) });
  }
};
