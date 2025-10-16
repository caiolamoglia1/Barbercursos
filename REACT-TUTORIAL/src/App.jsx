// src/modules/go-academy/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage/LoginPage';
import CoursesPage from './pages/CoursesPage/CoursesPage';
import ModulesPage from './pages/ModulesPage/ModulesPage';
import PlayerPage from './pages/PlayerPage/PlayerPage';
import AdminPage from './pages/AdminPage/AdminPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import PlansPage from './pages/PlansPage/PlansPage';
import './index.css';
import './App.css';

function App() {
  return (
    <div className="go-academy-root go-academy-body go-academy-reset">
      <AuthProvider>
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
          <Route path="/curso-barbearia/admin" element={<AdminPage />} />
          {/* Rotas sem prefixo para compatibilidade */}
          <Route path="treinamentos" element={<LoginPage />} />
          <Route path="cursos" element={<CoursesPage />} />
          <Route path="modulos" element={<ModulesPage />} />
          <Route path="tutorial/:id" element={<ModulesPage />} />
          <Route path="player" element={<PlayerPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
