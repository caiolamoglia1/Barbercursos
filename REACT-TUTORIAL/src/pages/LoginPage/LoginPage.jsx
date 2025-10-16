// src/modules/go-academy/pages/LoginPage/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css'; // Passo CRÍTICO: Importa os estilos
import InstagramIcon from '../../components/InstagramIcon/InstagramIcon';
import barberLogo from '../../images/—Pngtree—cartoons depicting barber_2820272.png';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'BarberAcademy - Academia do Barbeiro Profissional';
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // ao logar com sucesso, o listener onAuthStateChanged do AuthProvider
      // atualizará currentUser; navegamos para a área de cursos
      navigate('/curso-barbearia/cursos');
    } catch (err) {
      console.error('login error', err);
      setError(err.message || 'Falha ao autenticar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="go-academy-login-page-container">
      
      {/* SEÇÃO ESQUERDA: O FORMULÁRIO */}
      <section className="go-academy-login-form-section">
        <div className="go-academy-form-wrapper">
         
          <main className="go-academy-form-main">
            <img src={barberLogo} alt="BarberAcademy Logo" className="go-academy-form-logo" />
            <h1>ACESSE E APROVEITE</h1>
            
            {error && <div className="go-academy-login-error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="go-academy-input-group">
                <i className="fa fa-envelope go-academy-input-icon"></i>
                <input 
                  type="email" 
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="go-academy-input-group">
                <i className="fa fa-lock go-academy-input-icon"></i>
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <i 
                  className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} go-academy-password-toggle`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
              
              
              
              <button type="submit" className="go-academy-login-btn" disabled={loading}>
                {loading ? 'ENTRANDO...' : 'ACESSAR'}
              </button>
            </form>
          </main>
         
        </div>
      </section>

      {/* SEÇÃO DIREITA: A IMAGEM PROMOCIONAL */}
      <section className="go-academy-login-promo-section">
        <img src={barberLogo} className="go-academy-promo-image" alt="BarberAcademy Logo" />
      </section>

      <InstagramIcon />

    </div>
  );
}

export default LoginPage;
