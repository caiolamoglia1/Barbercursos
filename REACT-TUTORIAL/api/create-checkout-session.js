// api/create-checkout-session.js
import Stripe from 'stripe';

// Mapeamento dos Price IDs
const STRIPE_PLANS = {
  basic: 'price_1SIYKzRpeDjVow8XmJz7Hqcl',
  pro: 'price_1SIZ4XRpeDjVow8XSwYJZ7Ox',
  elite: 'price_1SIsuTRpeDjVow8XEMa18RjB'
};

export default async function handler(req, res) {
  // Enable CORS com domínio específico (mais seguro)
  const allowedOrigins = [
    'http://localhost:5173',
    'https://barbercursos-czba.vercel.app', // Seu domínio Vercel
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  ].filter(Boolean);
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log('🔍 Verificando variáveis de ambiente...');
    console.log('Environment keys:', Object.keys(process.env).filter(k => k.includes('STRIPE')));
    
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      console.error('❌ STRIPE_SECRET_KEY not configured in Vercel Environment Variables');
      return res.status(500).json({ 
        error: 'Stripe not configured. Please add STRIPE_SECRET_KEY to Vercel Environment Variables.' 
      });
    }

    console.log('✅ Stripe secret encontrado, inicializando...');
    const stripe = Stripe(stripeSecret);
    
    const { planId, userId } = req.body || {};
    console.log('📦 Request body:', { planId, userId });

    if (!planId || !userId) {
      return res.status(400).json({ error: 'planId and userId required' });
    }

    const priceId = STRIPE_PLANS[planId];
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }

    console.log('Creating checkout session for:', { planId, userId, priceId });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.headers.origin || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
      cancel_url: `${req.headers.origin || 'http://localhost:5173'}/curso-barbearia/planos`,
      client_reference_id: userId,
      metadata: { planId, userId }
    });

    console.log('Checkout session created:', session.id);
    return res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('create-checkout-session error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
