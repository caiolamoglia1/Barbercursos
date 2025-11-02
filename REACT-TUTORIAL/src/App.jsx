// src/modules/go-academy/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import LoginPage from './pages/LoginPage/LoginPage';
import CoursesPage from './pages/CoursesPage/CoursesPage';
import ModulesPage from './pages/ModulesPage/ModulesPage';
import PlayerPage from './pages/PlayerPage/PlayerPage';
import AdminPage from './pages/AdminPage/AdminPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import PlansPage from './pages/PlansPage/PlansPage';
import SuccessPage from './pages/SuccessPage/SuccessPage';
import { useUserSync } from './hooks/useUserSync';
import './index.css';
import './App.css';

function AppContent() {
  // Sincroniza dados do usuário no Firestore
  useUserSync();

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/curso-barbearia" element={<LoginPage />} />
      <Route path="/curso-barbearia/treinamentos" element={<LoginPage />} />
      <Route path="/curso-barbearia/cursos" element={<CoursesPage />} />
      <Route path="/curso-barbearia/modulos" element={<ModulesPage />} />
      <Route path="/curso-barbearia/tutorial/:id" element={<ModulesPage />} />
      <Route path="/curso-barbearia/player" element={<PlayerPage />} />
      <Route path="/curso-barbearia/perfil" element={<ProfilePage />} />
      <Route path="/curso-barbearia/planos" element={<PlansPage />} />
      <Route path="/curso-barbearia/admin" element={
        <AdminRoute>
          <AdminPage />
        </AdminRoute>
      } />
      <Route path="/success" element={<SuccessPage />} />
      {/* Rotas sem prefixo para compatibilidade */}
      <Route path="treinamentos" element={<LoginPage />} />
      <Route path="cursos" element={<CoursesPage />} />
      <Route path="modulos" element={<ModulesPage />} />
      <Route path="tutorial/:id" element={<ModulesPage />} />
      <Route path="player" element={<PlayerPage />} />
      <Route path="admin" element={
        <AdminRoute>
          <AdminPage />
        </AdminRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <div className="go-academy-root go-academy-body go-academy-reset">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
}

export default App;
