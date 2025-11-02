import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import './SuccessPage.css';

function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const plan = searchParams.get('plan');
  const sessionId = searchParams.get('session_id');
  const isMock = searchParams.get('mock') === 'true';
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    document.title = 'Pagamento Aprovado - BarberAcademy';
  }, []);

  // Ativa a assinatura automaticamente ao carregar a página
  useEffect(() => {
    const activateSubscription = async () => {
      if (!currentUser || !plan || activated || activating) return;

      setActivating(true);
      
      try {
        console.log('🔄 Ativando assinatura...', { userId: currentUser.uid, plan });
        
        const subscriptionRef = doc(db, 'users', currentUser.uid, 'subscriptions', plan);
        
        await setDoc(subscriptionRef, {
          active: true,
          stripeSubscriptionId: sessionId || 'manual_activation',
          planId: plan,
          startedAt: serverTimestamp(),
          method: 'stripe',
          status: 'active'
        });
        
        console.log('✅ Assinatura ativada com sucesso!');
        setActivated(true);
      } catch (error) {
        console.error('❌ Erro ao ativar assinatura:', error);
      } finally {
        setActivating(false);
      }
    };

    activateSubscription();
  }, [currentUser, plan, sessionId, activated, activating]);

  const handleContinue = () => {
    navigate('/curso-barbearia/cursos');
  };

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-icon">
          {activating ? '⏳' : '✅'}
        </div>
        
        <h1>{activating ? 'Ativando sua assinatura...' : 'Pagamento Aprovado!'}</h1>
        
        {isMock && (
          <div className="mock-badge">
            🧪 MODO DESENVOLVIMENTO
          </div>
        )}
        
        {activating && (
          <p className="activating-message">
            Aguarde enquanto configuramos seu acesso...
          </p>
        )}
        
        {!activating && (
          <>
            <p>
              Parabéns! Sua assinatura do <strong>Plano {plan}</strong> foi ativada com sucesso.
            </p>
            
            <p>
              Agora você tem acesso completo aos cursos de barbearia profissional.
            </p>
            
            <div className="success-actions">
              <button 
                className="btn-primary" 
                onClick={handleContinue}
                disabled={activating}
              >
                Começar a Aprender
              </button>
            </div>
            
            <div className="success-info">
              <h3>O que você ganhou:</h3>
              <ul>
                <li>✅ Acesso a todos os módulos</li>
                <li>✅ Certificados digitais</li>
                <li>✅ Suporte via chat</li>
                <li>✅ Atualizações gratuitas</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SuccessPage;