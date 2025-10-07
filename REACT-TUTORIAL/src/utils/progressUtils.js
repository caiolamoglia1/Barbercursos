// src/utils/progressUtils.js
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Salva o progresso do usuário no Firebase
 * @param {string} userId - ID do usuário
 * @param {string} tutorialId - ID do tutorial
 * @param {string} moduleId - ID do módulo
 * @param {boolean} completed - Se o módulo foi completado
 */
export const saveUserProgress = async (userId, tutorialId, moduleId, completed = false) => {
  try {
    console.log('Salvando progresso:', { userId, tutorialId, moduleId, completed });
    
    // Salva em um único documento por tutorial
    const tutorialRef = doc(db, 'userProgress', userId, 'tutorials', tutorialId);
    
    // Primeiro carrega o progresso atual
    const tutorialDoc = await getDoc(tutorialRef);
    const currentData = tutorialDoc.exists() ? tutorialDoc.data() : { modules: {} };
    
    // Atualiza o módulo específico
    currentData.modules = currentData.modules || {};
    currentData.modules[moduleId] = {
      status: completed ? 'completed' : 'in-progress',
      completedAt: completed ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    };
    
    // Salva de volta
    await setDoc(tutorialRef, {
      ...currentData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    console.log('Progresso salvo com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
    return false;
  }
};

/**
 * Carrega o progresso do usuário do Firebase
 * @param {string} userId - ID do usuário
 * @param {string} tutorialId - ID do tutorial
 * @param {string} moduleId - ID do módulo (opcional)
 * @returns {object|null} - Dados do progresso ou null se não existir
 */
export const loadUserProgress = async (userId, tutorialId, moduleId) => {
  try {
    const tutorialRef = doc(db, 'userProgress', userId, 'tutorials', tutorialId);
    const tutorialDoc = await getDoc(tutorialRef);
    
    if (!tutorialDoc.exists()) {
      return moduleId ? null : { completedModules: [], moduleStatuses: {} };
    }
    
    const data = tutorialDoc.data();
    const modules = data.modules || {};
    
    // Se moduleId foi fornecido, retorna só esse módulo
    if (moduleId) {
      return modules[moduleId] || null;
    }
    
    // Se não, retorna o progresso de todo o tutorial
    return loadTutorialProgress(userId, tutorialId);
  } catch (error) {
    console.error('Erro ao carregar progresso:', error);
    return moduleId ? null : { completedModules: [], moduleStatuses: {} };
  }
};

/**
 * Carrega o progresso de todos os módulos de um tutorial
 * @param {string} userId - ID do usuário
 * @param {string} tutorialId - ID do tutorial
 * @returns {object} - Dados do progresso do tutorial
 */
export const loadTutorialProgress = async (userId, tutorialId) => {
  try {
    const tutorialRef = doc(db, 'userProgress', userId, 'tutorials', tutorialId);
    const tutorialDoc = await getDoc(tutorialRef);
    
    if (!tutorialDoc.exists()) {
      return {
        completedModules: [],
        moduleStatuses: {}
      };
    }
    
    const data = tutorialDoc.data();
    const modules = data.modules || {};
    
    const completedModules = [];
    const moduleStatuses = {};
    
    Object.entries(modules).forEach(([moduleId, moduleData]) => {
      moduleStatuses[moduleId] = moduleData.status || 'not-started';
      if (moduleData.status === 'completed') {
        completedModules.push(moduleId);
      }
    });
    
    return {
      completedModules,
      moduleStatuses
    };
  } catch (error) {
    // Silenciosamente retorna estrutura vazia para evitar logs repetitivos
    return {
      completedModules: [],
      moduleStatuses: {}
    };
  }
};

/**
 * Valida e ordena os módulos por ordem numérica
 * @param {array} modules - Array de módulos
 * @returns {array} - Array de módulos ordenados
 */
export const validateAndOrderModules = (modules) => {
  if (!Array.isArray(modules)) {
    console.error('validateAndOrderModules: esperava um array, recebeu:', typeof modules);
    return [];
  }
  
  // Ordena os módulos pela propriedade 'order' ou 'moduleId'
  return modules.sort((a, b) => {
    const orderA = a.order || parseInt(a.moduleId) || 0;
    const orderB = b.order || parseInt(b.moduleId) || 0;
    return orderA - orderB;
  });
};

/**
 * Calcula a porcentagem de progresso do usuário em um tutorial
 * @param {array} modules - Array de módulos do tutorial
 * @param {object} userProgress - Objeto com o progresso do usuário
 * @returns {number} - Porcentagem de progresso (0-100)
 */
export const calculateProgress = (modules, userProgress) => {
  if (!modules || modules.length === 0) return 0;
  
  const completedModules = modules.filter(module => {
    const progress = userProgress?.[module.moduleId];
    return progress?.status === 'completed';
  });
  
  return Math.round((completedModules.length / modules.length) * 100);
};
