import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage/LoginPage';
import CoursesPage from './pages/CoursesPage/CoursesPage';
import ModulesPage from './pages/ModulesPage/ModulesPage';
import PlayerPage from './pages/PlayerPage/PlayerPage';
import AdminPage from './pages/AdminPage/AdminPage';
import Header from './components/Header/Header';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/cursos" element={<PrivateRoute><CoursesPage /></PrivateRoute>} />
          <Route path="/modulos" element={<PrivateRoute><ModulesPage /></PrivateRoute>} />
          <Route path="/tutorial/:id" element={<PrivateRoute><ModulesPage /></PrivateRoute>} />
          <Route path="/player" element={<PrivateRoute><PlayerPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminPage /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

