// functions/create_test_prices.js
// Creates Stripe Products + Prices for plans with placeholder stripePriceId

const admin = require('firebase-admin');

(async () => {
  try {
    admin.initializeApp();
    const db = admin.firestore();
    if (process.env.FIRESTORE_EMULATOR_HOST) {
      db.settings({ host: process.env.FIRESTORE_EMULATOR_HOST, ssl: false });
    }

    const Stripe = require('stripe');
    const stripe = Stripe(process.env.STRIPE_SECRET);

    const plansToCreate = [
      { id: 'pro', nickname: 'Plano Pro', unit_amount: 2900, interval: 'month' },
      { id: 'elite', nickname: 'Plano Elite', unit_amount: 19900, interval: 'year' }
    ];

    for (const p of plansToCreate) {
      const planRef = db.collection('plans').doc(p.id);
      const planDoc = await planRef.get();
      if (!planDoc.exists) {
        console.log('Plan doc missing, skipping', p.id);
        continue;
      }
      const current = planDoc.data();
      const currentId = current && current.stripePriceId;
      // Force recreate price for testing (overwrite placeholders)
      console.log('Creating product and price for plan', p.id, '(overwriting existing stripePriceId if any)');
      const product = await stripe.products.create({ name: p.nickname });
      const price = await stripe.prices.create({
        unit_amount: p.unit_amount,
        currency: 'brl',
        recurring: { interval: p.interval },
        product: product.id
      });

  await planRef.update({ stripePriceId: price.id });
      console.log('Created price', price.id, 'for plan', p.id);
    }

    console.log('Done creating prices');
    process.exit(0);
  } catch (err) {
    console.error('err', err && (err.message || err));
    process.exit(1);
  }
})();
