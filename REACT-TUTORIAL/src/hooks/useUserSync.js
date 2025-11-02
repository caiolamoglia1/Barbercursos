// Hook para sincronizar dados do usuário no Firestore
import { useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook que sincroniza os dados do usuário no Firestore
 * Cria/atualiza o documento do usuário com email, nome, etc.
 */
export const useUserSync = () => {
  const { currentUser } = useAuth();

  // Lista de emails de administradores
  const ADMIN_EMAILS = ['admin@gmail.com'];

  useEffect(() => {
    const syncUser = async () => {
      if (!currentUser) return;

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        
        const userData = {
          email: currentUser.email,
          displayName: currentUser.displayName || null,
          photoURL: currentUser.photoURL || null,
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        // Adiciona role de admin se o email estiver na lista
        if (ADMIN_EMAILS.includes(currentUser.email)) {
          userData.role = 'admin';
          userData.isAdmin = true;
          console.log('👑 Usuário admin detectado:', currentUser.email);
        }
        
        await setDoc(userRef, userData, { merge: true }); // merge: true não sobrescreve campos existentes como subscriptions

        console.log('✅ Dados do usuário sincronizados:', currentUser.email);
      } catch (error) {
        console.error('❌ Erro ao sincronizar usuário:', error);
      }
    };

    syncUser();
  }, [currentUser]);
};
