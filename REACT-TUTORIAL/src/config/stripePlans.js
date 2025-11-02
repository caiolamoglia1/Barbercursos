// Mapeamento dos planos com os Price IDs do Stripe
export const STRIPE_PLANS = {
  basic: {
    priceId: 'price_1SIYKzRpeDjVow8XmJz7Hqcl',
    name: 'Plano Básico',
    price: 'R$ 29,90/mês',
    features: [
      'Acesso a módulos limitados',
      'Visualização limitada de vídeos',
      'Sem certificados'
    ]
  },
  pro: {
    priceId: 'price_1SIZ4XRpeDjVow8XSwYJZ7Ox',
    name: 'Plano Pro',
    price: 'R$ 29/mês',
    features: [
      'Acesso completo a todos os módulos',
      'Certificados digitais',
      'Suporte via chat'
    ]
  },
  elite: {
    priceId: 'price_1SIsuTRpeDjVow8XEMa18RjB',
    name: 'Plano Elite',
    price: 'R$ 199/ano',
    features: [
      'Tudo do Pro',
      'Aulas exclusivas mensais',
      'Certificado físico'
    ]
  }
};

export const getPlanPriceId = (planId) => {
  return STRIPE_PLANS[planId]?.priceId || null;
};
