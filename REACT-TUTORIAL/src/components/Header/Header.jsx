// Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  // Verifica se o usuário é admin pelo email
  const isAdmin = currentUser?.email === 'admin@gmail.com';

  const handleLogout = async () => {
    try {
      await logout();
      // Usar replace para impedir que o usuário volte pelas abas
      window.location.replace('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="user-info">
          {currentUser && (
            <>
              <span>Olá, {currentUser.displayName || currentUser.email}</span>
              {isAdmin && (
                <span 
                  className="admin-badge"
                  onClick={() => navigate('/admin')}
                  style={{
                    marginLeft: '10px',
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#000',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  👑 ADMIN
                </span>
              )}
            </>
          )}
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
