// src/pages/ProfilePage/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import InstagramIcon from '../../components/InstagramIcon/InstagramIcon';
import './ProfilePage.css';
import barberLogo from '../../images/—Pngtree—cartoons depicting barber_2820272.png';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [userData, setUserData] = useState({
    nome: '',
    email: currentUser?.email || '',
    telefone: '',
    cidade: '',
    experiencia: 'iniciante',
    biografia: '',
    avatar: null
  });

  useEffect(() => {
    document.title = 'Meu Perfil - BarberAcademy';
    
    // Carregar dados do localStorage (simulação)
    const savedData = localStorage.getItem('userProfile');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setUserData(parsedData);
      if (parsedData.avatar) {
        setAvatarPreview(parsedData.avatar);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida');
        return;
      }

      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAvatarPreview(base64String);
        setUserData(prev => ({
          ...prev,
          avatar: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      document.getElementById('avatar-upload-input').click();
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setUserData(prev => ({
      ...prev,
      avatar: null
    }));
  };

  const handleSave = () => {
    // Salvar no localStorage (em produção seria no Firebase)
    localStorage.setItem('userProfile', JSON.stringify(userData));
    setIsEditing(false);
    
    // Feedback visual
    const successMsg = document.createElement('div');
    successMsg.className = 'barber-profile-success-toast';
    successMsg.innerHTML = '<i class="fa fa-check-circle"></i> Perfil atualizado com sucesso!';
    document.body.appendChild(successMsg);
    setTimeout(() => successMsg.remove(), 3000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/curso-barbearia');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="barber-profile-page">
        <div className="barber-profile-container">
          
          {/* Header */}
          <div className="barber-profile-header">
            <button 
              className="barber-profile-back-btn"
              onClick={() => navigate('/curso-barbearia/cursos')}
            >
              <i className="fa fa-arrow-left"></i>
              Voltar
            </button>
            <h1>
              <i className="fa fa-user-circle"></i>
              Meu Perfil
            </h1>
          </div>

          {/* Profile Card */}
          <div className="barber-profile-card">
            
            {/* Avatar Section */}
            <div className="barber-profile-avatar-section">
              <div className="barber-profile-avatar" onClick={handleAvatarClick}>
                <img 
                  src={avatarPreview || barberLogo} 
                  alt="Avatar" 
                  style={{ 
                    padding: avatarPreview ? '0' : '10px',
                    objectFit: avatarPreview ? 'cover' : 'contain'
                  }}
                />
                <div className="barber-profile-avatar-overlay">
                  <i className={`fa ${isEditing ? 'fa-camera' : 'fa-user'}`}></i>
                </div>
                {isEditing && avatarPreview && (
                  <button 
                    className="barber-profile-avatar-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAvatar();
                    }}
                    title="Remover foto"
                  >
                    <i className="fa fa-times"></i>
                  </button>
                )}
              </div>
              <input
                type="file"
                id="avatar-upload-input"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
              <div className="barber-profile-user-info">
                <h2>{userData.nome || 'Barbeiro Profissional'}</h2>
                <p className="barber-profile-email">
                  <i className="fa fa-envelope"></i>
                  {userData.email}
                </p>
                {isEditing && (
                  <p className="barber-profile-avatar-hint">
                    <i className="fa fa-info-circle"></i>
                    Clique no avatar para alterar a foto
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="barber-profile-stats">
              <div className="barber-profile-stat-item">
                <i className="fa fa-graduation-cap"></i>
                <span className="barber-profile-stat-value">0</span>
                <span className="barber-profile-stat-label">Cursos Completos</span>
              </div>
              <div className="barber-profile-stat-item">
                <i className="fa fa-certificate"></i>
                <span className="barber-profile-stat-value">0</span>
                <span className="barber-profile-stat-label">Certificados</span>
              </div>
              <div className="barber-profile-stat-item">
                <i className="fa fa-trophy"></i>
                <span className="barber-profile-stat-value">0%</span>
                <span className="barber-profile-stat-label">Progresso</span>
              </div>
            </div>

            {/* Edit Toggle Button */}
            <div className="barber-profile-edit-toggle">
              {!isEditing ? (
                <button 
                  className="barber-profile-edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="fa fa-edit"></i>
                  Editar Perfil
                </button>
              ) : (
                <div className="barber-profile-action-buttons">
                  <button 
                    className="barber-profile-save-btn"
                    onClick={handleSave}
                  >
                    <i className="fa fa-check"></i>
                    Salvar
                  </button>
                  <button 
                    className="barber-profile-cancel-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    <i className="fa fa-times"></i>
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {/* Form */}
            <form className="barber-profile-form">
              
              <div className="barber-profile-form-group">
                <label>
                  <i className="fa fa-user"></i>
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="nome"
                  value={userData.nome}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div className="barber-profile-form-group">
                <label>
                  <i className="fa fa-envelope"></i>
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  disabled
                  className="barber-profile-input-disabled"
                />
              </div>

              <div className="barber-profile-form-row">
                <div className="barber-profile-form-group">
                  <label>
                    <i className="fa fa-phone"></i>
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={userData.telefone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="barber-profile-form-group">
                  <label>
                    <i className="fa fa-map-marker"></i>
                    Cidade
                  </label>
                  <input
                    type="text"
                    name="cidade"
                    value={userData.cidade}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Sua cidade"
                  />
                </div>
              </div>

              <div className="barber-profile-form-group">
                <label>
                  <i className="fa fa-chart-line"></i>
                  Nível de Experiência
                </label>
                <select
                  name="experiencia"
                  value={userData.experiencia}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                  <option value="profissional">Profissional</option>
                </select>
              </div>

              <div className="barber-profile-form-group">
                <label>
                  <i className="fa fa-align-left"></i>
                  Biografia
                </label>
                <textarea
                  name="biografia"
                  value={userData.biografia}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Conte um pouco sobre você e sua jornada na barbearia..."
                  rows="4"
                />
              </div>

            </form>

            {/* Logout Button */}
            <div className="barber-profile-logout-section">
              <button 
                className="barber-profile-logout-btn"
                onClick={handleLogout}
              >
                <i className="fa fa-sign-out"></i>
                Sair da Conta
              </button>
            </div>

          </div>

        </div>
      </div>
      <InstagramIcon />
    </>
  );
};

export default ProfilePage;
