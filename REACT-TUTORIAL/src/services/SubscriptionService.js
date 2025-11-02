import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Verifica se o usuário tem uma assinatura ativa
 * @param {string} userId - ID do usuário
 * @param {string} planId - ID do plano (opcional, verifica qualquer plano se não informado)
 * @returns {Promise<Object>} { hasSubscription: boolean, subscription: Object|null }
 */
export const checkUserSubscription = async (userId, planId = null) => {
  try {
    if (!userId) {
      return { hasSubscription: false, subscription: null };
    }

    const subscriptionsRef = collection(db, 'users', userId, 'subscriptions');
    
    // Se planId for informado, busca apenas aquele plano
    const subscriptionsQuery = planId 
      ? query(subscriptionsRef, where('planId', '==', planId), where('active', '==', true))
      : query(subscriptionsRef, where('active', '==', true));
    
    const querySnapshot = await getDocs(subscriptionsQuery);
    
    if (!querySnapshot.empty) {
      const subscription = querySnapshot.docs[0].data();
      return { 
        hasSubscription: true, 
        subscription: {
          ...subscription,
          id: querySnapshot.docs[0].id
        }
      };
    }
    
    return { hasSubscription: false, subscription: null };
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    return { hasSubscription: false, subscription: null };
  }
};

/**
 * Verifica se o usuário pode acessar um curso específico
 * @param {string} userId - ID do usuário
 * @param {string} courseId - ID do curso
 * @returns {Promise<boolean>}
 */
export const canAccessCourse = async (userId, courseId) => {
  try {
    // Por enquanto, qualquer assinatura ativa libera todos os cursos
    // Você pode adicionar lógica mais complexa aqui
    const { hasSubscription } = await checkUserSubscription(userId);
    return hasSubscription;
  } catch (error) {
    console.error('Erro ao verificar acesso ao curso:', error);
    return false;
  }
};

/**
 * Retorna lista de planos do usuário
 * @param {string} userId - ID do usuário
 * @returns {Promise<Array>}
 */
export const getUserSubscriptions = async (userId) => {
  try {
    if (!userId) return [];

    const subscriptionsRef = collection(db, 'users', userId, 'subscriptions');
    const querySnapshot = await getDocs(subscriptionsRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar assinaturas:', error);
    return [];
  }
};
