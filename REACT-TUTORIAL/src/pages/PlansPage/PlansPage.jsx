import React, { useState } from 'react';
import './PlansPage.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import InstagramIcon from '../../components/InstagramIcon/InstagramIcon';
import { useAuth } from '../../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

// Initialize with a placeholder; replace with your publishable key or load from env at build time
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SIY5TRpeDjVow8Xf73BpmMqf7wZ0gAnigMp8oaTEUOinxLYT184gbzMXXIuL1NdjOgL9v5fbykcxME23BlQY66400nOC5ZzLn');

const PlansPage = () => {
  const { currentUser } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState(null);

  // New: start Stripe Checkout flow
  const handleStripeSubscribe = async (planId) => {
    if (!currentUser) return alert('Você precisa estar logado para assinar.');
    setLoadingPlan(planId);
    try {
      const resp = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, userId: currentUser.uid })
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);

      // Prefer backend-provided URL (works with newer Stripe responses)
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      // Fallback to redirectToCheckout using sessionId
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (error) {
        console.error('Stripe redirect error', error);
        alert('Erro ao redirecionar para o Stripe.');
      }
    } catch (err) {
      console.error('create-checkout-session error', err);
      alert('Não foi possível iniciar o pagamento.');
    } finally {
      setLoadingPlan(null);
    }
  };

  // Fallback / existing manual subscribe endpoint
  const handleBuy = async (planId) => {
    try {
      const userId = currentUser ? currentUser.uid : 'guest';
      const resp = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, userId })
      });
      const data = await resp.json();
      if (data && data.success) {
        alert('Assinatura ativada com sucesso!');
      } else {
        console.error('subscribe failed', data);
        alert('Erro ao ativar assinatura.');
      }
    } catch (err) {
      console.error('subscribe error', err);
      alert('Erro ao ativar assinatura.');
    }
  };

  return (
    <>
      <Sidebar />
      <main className="barber-plans-page">
        <div className="barber-plans-container">
          <h1>Planos de Assinatura</h1>
          <p className="barber-plans-sub">Escolha o plano que combina com seu ritmo de aprendizado.</p>

          <div className="barber-plans-grid">
            <article className="barber-plan-card barber-plan-card-basic">
              <div className="barber-plan-badge" aria-hidden="true">
                <i className="fa fa-star"></i>
              </div>
              <div className="barber-plan-header">
                <h3>Plano Básico</h3>
                <span className="barber-plan-price">19,90</span>
              </div>
              <ul className="barber-plan-features">
                <li>Acesso a módulos limitados</li>
                <li>Visualização limitada de vídeos</li>
                <li>Sem certificados</li>
              </ul>
              <div className="barber-plan-cta">
                <button onClick={() => handleBuy('basic')} className="barber-choose-btn barber-choose-btn-outline">Começar grátis</button>
              </div>
            </article>

            <article className="barber-plan-card barber-plan-card-pro">
              <div className="barber-plan-badge" aria-hidden="true">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
              </div>
              <div className="barber-plan-header">
                <h3>Plano Pro</h3>
                <span className="barber-plan-price">R$29/mês</span>
              </div>
              <ul className="barber-plan-features">
                <li>Acesso completo a todos os módulos</li>
                <li>Certificados digitais</li>
                <li>Suporte via chat</li>
              </ul>
              <div className="barber-plan-cta">
                <button onClick={() => handleStripeSubscribe('pro')} className="barber-choose-btn barber-choose-btn-outline">Assinar Pro</button>
              </div>
            </article>

            <article className="barber-plan-card barber-plan-card-elite">
              <div className="barber-plan-badge" aria-hidden="true">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
              </div>
              <div className="barber-plan-header">
                <h3>Plano Elite</h3>
                <span className="barber-plan-price">R$199/ano</span>
              </div>
              <ul className="barber-plan-features">
                <li>Tudo do Pro</li>
                <li>Aulas exclusivas mensais</li>
                <li>Certificado físico</li>
              </ul>
              <div className="barber-plan-cta">
                <button onClick={() => handleStripeSubscribe('elite')} className="barber-choose-btn barber-choose-btn-outline">Assinar Elite</button>
              </div>
            </article>
          </div>
        </div>
      </main>
      <InstagramIcon />
    </>
  );
};

export default PlansPage;
