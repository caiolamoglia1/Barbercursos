import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children, adminOnly = false }) {
  const { currentUser } = useAuth();

  // Se não estiver logado, redireciona para login
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  // Se requer admin e o usuário não for admin, redireciona para cursos
  if (adminOnly && !isAdmin(currentUser.email)) {
    return <Navigate to="/cursos" />;
  }

  return children;
}

// Função para verificar se o usuário é admin (baseado no email)
function isAdmin(email) {
  const adminEmails = ['admin@goparts.com', 'caio@goparts.com']; // Adicione emails de admin aqui
  return adminEmails.includes(email);
}

export default PrivateRoute;