import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SubscriptionRequired.css';

const SubscriptionRequired = ({ courseName }) => {
  const navigate = useNavigate();

  return (
    <div className="subscription-required">
      <div className="subscription-required-content">
        <div className="lock-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h2>Conteúdo Exclusivo para Assinantes</h2>
        
        <p className="subscription-message">
          {courseName ? `O curso "${courseName}" está` : 'Este conteúdo está'} disponível apenas para membros com assinatura ativa.
        </p>
        
        <div className="subscription-benefits">
          <h3>Com a assinatura você tem acesso a:</h3>
          <ul>
            <li>✅ Todos os cursos da plataforma</li>
            <li>✅ Novos conteúdos toda semana</li>
            <li>✅ Certificado de conclusão</li>
            <li>✅ Suporte prioritário</li>
            <li>✅ Comunidade exclusiva</li>
          </ul>
        </div>
        
        <div className="subscription-actions">
          <button 
            className="btn-subscribe-now"
            onClick={() => navigate('/curso-barbearia/planos')}
          >
            Ver Planos e Assinar
          </button>
          
          <button 
            className="btn-back"
            onClick={() => navigate('/curso-barbearia')}
          >
            Voltar aos Cursos
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRequired;
