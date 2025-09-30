// Header.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { logout, currentUser } = useAuth();

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
            <span>Olá, {currentUser.displayName || currentUser.email}</span>
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
