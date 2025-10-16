// functions/create_session_auto.js
const admin = require('firebase-admin');

(async () => {
  try {
    admin.initializeApp();
    const db = admin.firestore();
    if (process.env.FIRESTORE_EMULATOR_HOST) {
      db.settings({ host: process.env.FIRESTORE_EMULATOR_HOST, ssl: false });
    }

    const planId = 'pro';
    const planRef = db.collection('plans').doc(planId);
    const planDoc = await planRef.get();
    if (!planDoc.exists) {
      console.error('plan not found');
      process.exit(1);
    }

    let priceId = planDoc.data().stripePriceId;
    if (!priceId) {
      console.error('plan missing stripePriceId');
      process.exit(1);
    }

    const Stripe = require('stripe');
    const stripe = Stripe(process.env.STRIPE_SECRET);

    // If user accidentally stored a product id (prod_...), find an associated price and update the doc
    if (priceId.startsWith('prod_')) {
      console.log('Detected product id in stripePriceId, searching for a Price...');
      const prices = await stripe.prices.list({ product: priceId, limit: 10 });
      if (!prices || !prices.data || prices.data.length === 0) {
        console.error('No prices found for product', priceId);
        process.exit(1);
      }
      // Prefer recurring prices, otherwise pick first
      const recurring = prices.data.find(p => p.recurring);
      const chosen = recurring || prices.data[0];
      priceId = chosen.id;
      console.log('Found price:', priceId, ' — updating plan document...');
      await planRef.update({ stripePriceId: priceId });
    }

    // Create checkout session
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
