// api/stripe-webhook.js
import initAdmin from './_admin.js';
import Stripe from 'stripe';

// Configuração para receber raw body (necessário para verificação de assinatura Stripe)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!stripeSecret || !webhookSecret) {
    console.error('❌ Stripe secrets not configured');
    return res.status(500).send('Stripe secrets not configured');
  }

  const stripe = Stripe(stripeSecret);

  // Obter raw body para verificação de assinatura
  const signature = req.headers['stripe-signature'];
  let rawBody;
  
  try {
    // Vercel expõe o body como Buffer quando bodyParser está desabilitado
    rawBody = await new Promise((resolve, reject) => {
      let buffer = '';
      req.on('data', chunk => buffer += chunk);
      req.on('end', () => resolve(buffer));
      req.on('error', reject);
    });
  } catch (err) {
    console.error('❌ Error reading request body:', err);
    return res.status(400).send('Error reading request body');
  }

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
}
