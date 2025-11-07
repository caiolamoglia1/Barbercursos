// api/stripe-webhook.config.js
// Configuração especial para Vercel receber raw body no webhook do Stripe
module.exports = {
  api: {
    bodyParser: false,
  },
};
