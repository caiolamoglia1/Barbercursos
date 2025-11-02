// src/contexts/AdminContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin deve ser usado dentro de um AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lista de emails de administradores
  const ADMIN_EMAILS = ['admin@gmail.com'];

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      
      if (!currentUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Verifica se o email está na lista de admins
        const isEmailAdmin = ADMIN_EMAILS.includes(currentUser.email);
        
        // Também verifica no Firestore se tem role de admin
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();
        const hasAdminRole = userData?.role === 'admin';

        setIsAdmin(isEmailAdmin || hasAdminRole);
        
        // Se o usuário é admin por email mas não tem a role no Firestore, adiciona
        if (isEmailAdmin && !hasAdminRole) {
          console.log('Admin detectado, atualizando role no Firestore...');
          // A role será adicionada pelo useUserSync
        }
        
      } catch (error) {
        console.error('Erro ao verificar status de admin:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [currentUser]);

  const value = {
    isAdmin,
    loading,
    ADMIN_EMAILS
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
