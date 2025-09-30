// src/pages/LoginPage/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css'; // Passo CRÍTICO: Importa os estilos
import logo from '../../assets/logo.svg'; // Importa o logo da pasta assets
import WhatsAppIcon from '../../components/WhatsAppIcon/WhatsAppIcon';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/cursos');
    } catch (error) {
      setError('Falha no login. Verifique suas credenciais.');
      console.error('Erro no login:', error);
    }

    setLoading(false);
  };

  return (
    <div className="login-page-container">
      
      {/* SEÇÃO ESQUERDA: O FORMULÁRIO */}
      <section className="login-form-section">
        <div className="form-wrapper">
          <header className="form-header">
            <h1>TREINAMENTOS</h1>
            
          </header>
          <main className="form-main">
            <img src="/gopartbrasil_logo.jpeg" alt="Logo da Empresa" className="form-logo" />
            <h1>ACESSE E APROVEITE</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <i className="fa fa-envelope input-icon"></i>
                <input 
                  type="email" 
                  placeholder="E-mail"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <i className="fa fa-lock input-icon"></i>
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <i 
                  className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
              
              
              
              <button type="submit" className="btn-acessar" disabled={loading}>
                {loading ? 'ENTRANDO...' : 'ACESSAR'}
              </button>
            </form>
          </main>
         
        </div>
      </section>

      {/* SEÇÃO DIREITA: A IMAGEM PROMOCIONAL */}
      <section className="promo-section">
        <img src="/gopartsW.png" className="promo-image" />
      </section>

      <WhatsAppIcon />

    </div>
  );
}

export default LoginPage;