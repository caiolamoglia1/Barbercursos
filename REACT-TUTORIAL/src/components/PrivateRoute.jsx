import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children, adminOnly = false }) {
  const { currentUser, loading } = useAuth();

  // Enquanto o estado de auth estiver carregando, não redirecionamos
  if (loading) return null;

  // Se não estiver logado, redireciona para login
  if (!currentUser) {
    return <Navigate to="/curso-barbearia" />;
  }

  // Se requer admin e o usuário não for admin, redireciona para cursos
  if (adminOnly && !isAdmin(currentUser.email)) {
    return <Navigate to="/curso-barbearia/cursos" />;
  }

  return children;
}

// Função para verificar se o usuário é admin (baseado no email)
function isAdmin(email) {
  // Lista de emails com acesso de administrador
  const adminEmails = ['admin@barberacademy.com', 'barbeiro@email.com']; // Substitua pelo email do barbeiro
  return adminEmails.includes(email);
}

export default PrivateRoute;