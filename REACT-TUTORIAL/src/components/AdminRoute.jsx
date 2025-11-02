// src/components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from './Spinner/Spinner';

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Verifica se o email é admin
  const isAdmin = currentUser.email === 'admin@gmail.com';

  if (!isAdmin) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '500px'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>🔒</h1>
          <h2 style={{ marginBottom: '10px' }}>Acesso Restrito</h2>
          <p style={{ marginBottom: '30px', opacity: 0.9 }}>
            Esta área é exclusiva para administradores.
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
