// src/components/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';
import barberLogo from '../../images/—Pngtree—cartoons depicting barber_2820272.png';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const openSidebar = () => {
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeSidebar();
      navigate('/curso-barbearia');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const menuItems = [
    { path: '/curso-barbearia/cursos', label: 'Cursos', icon: 'fa-graduation-cap' },
    { path: '/curso-barbearia/perfil', label: 'Meu Perfil', icon: 'fa-user' },
    { path: '/curso-barbearia/admin', label: 'Painel Admin', icon: 'fa-cog', adminOnly: true },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button 
        className={`barber-hamburger ${isOpen ? 'barber-hamburger-active' : ''}`}
        onClick={toggleSidebar}
        onMouseEnter={openSidebar}
        aria-label="Menu"
      >
        <span className="barber-hamburger-line"></span>
        <span className="barber-hamburger-line"></span>
        <span className="barber-hamburger-line"></span>
      </button>

      {/* Overlay */}
      <div 
        className={`barber-sidebar-overlay ${isOpen ? 'barber-sidebar-overlay-active' : ''}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <aside 
        className={`barber-sidebar ${isOpen ? 'barber-sidebar-open' : ''}`}
        onMouseLeave={closeSidebar}
      >
        <div className="barber-sidebar-header">
          <img src={barberLogo} alt="BarberAcademy" className="barber-sidebar-logo" />
          <h2 className="barber-sidebar-title">BarberAcademy</h2>
         
        </div>

        <nav className="barber-sidebar-nav">
          {currentUser && (
            <div className="barber-sidebar-user">
              <div className="barber-sidebar-user-avatar">
                <i className="fa fa-user"></i>
              </div>
              <div className="barber-sidebar-user-info">
                <span className="barber-sidebar-user-name">
                  {currentUser.email?.split('@')[0]}
                </span>
                <span className="barber-sidebar-user-email">{currentUser.email}</span>
              </div>
            </div>
          )}

          <ul className="barber-sidebar-menu">
            {menuItems.map((item, index) => (
              <li key={index} className="barber-sidebar-menu-item">
                <Link 
                  to={item.path}
                  className="barber-sidebar-menu-link"
                  onClick={closeSidebar}
                >
                  <i className={`fa ${item.icon} barber-sidebar-menu-icon`}></i>
                  <span>{item.label}</span>
                  <i className="fa fa-chevron-right barber-sidebar-menu-arrow"></i>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="barber-sidebar-footer">
          {currentUser && (
            <button 
              className="barber-sidebar-logout-btn"
              onClick={handleLogout}
            >
              <i className="fa fa-sign-out"></i>
              <span>Sair</span>
            </button>
          )}
          <div className="barber-sidebar-version">
            <p>Caio lamoglia</p>
            <p>© 2025 Todos os direitos reservados</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
