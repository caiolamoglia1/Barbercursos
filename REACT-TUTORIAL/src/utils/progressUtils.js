import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Salvar progresso do usuário no Firestore
export const saveUserProgress = async (userId, tutorialId, moduleId, completed = false) => {
  try {
    const progressRef = doc(db, 'userProgress', `${userId}_${tutorialId}`);
    const progressSnap = await getDoc(progressRef);

    let progressData = {
      userId,
      tutorialId,
      completedModules: [],
      moduleStatuses: {},
      lastUpdated: new Date()
    };

    if (progressSnap.exists()) {
      progressData = progressSnap.data();
    }

    // Adiciona módulo aos completados apenas quando a atividade é completada
    if (completed && !progressData.completedModules.includes(moduleId)) {
      progressData.completedModules.push(moduleId);
    }

    // Atualiza status do módulo se especificado (para atividades completadas)
    if (completed) {
      progressData.moduleStatuses = progressData.moduleStatuses || {};
      progressData.moduleStatuses[moduleId] = 'completed';
    }

    progressData.lastUpdated = new Date();

    await setDoc(progressRef, progressData);
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
  }
};

// Carregar progresso do usuário do Firestore
export const loadUserProgress = async (userId, tutorialId) => {
  try {
    const progressRef = doc(db, 'userProgress', `${userId}_${tutorialId}`);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      const data = progressSnap.data();
      return {
        completedModules: data.completedModules || [],
        moduleStatuses: data.moduleStatuses || {},
        lastUpdated: data.lastUpdated
      };
    }

    console.log('Nenhum progresso encontrado, retornando vazio');
    return {
      completedModules: [],
      moduleStatuses: {},
      lastUpdated: null
    };
  } catch (error) {
    console.error('Erro ao carregar progresso:', error);
    return {
      completedModules: [],
      moduleStatuses: {},
      lastUpdated: null
    };
  }
};

// Verificar se um módulo está completo
export const isModuleCompleted = async (userId, tutorialId, moduleId) => {
  try {
    const progress = await loadUserProgress(userId, tutorialId);
    return progress.moduleStatuses[moduleId] === 'completed';
  } catch (error) {
    console.error('Erro ao verificar status do módulo:', error);
    return false;
  }
};

// Função para validar e corrigir a ordem dos módulos
// Garante que sempre comece com vídeo e alterne: vídeo -> atividade -> vídeo -> atividade
export const validateAndOrderModules = (modules) => {
  if (!Array.isArray(modules) || modules.length === 0) {
    return modules;
  }

  // Criar uma cópia dos módulos para não modificar o original
  const orderedModules = [...modules];

  // Reordenar para garantir o padrão: vídeo -> atividade -> vídeo -> atividade
  // Primeiro módulo deve sempre ser vídeo
  let videoModules = orderedModules.filter(mod => mod.type === 'video');
  let activityModules = orderedModules.filter(mod => mod.type === 'atividade');

  const result = [];
  let videoIndex = 0;
  let activityIndex = 0;

  // Sempre começar com vídeo
  while (videoIndex < videoModules.length || activityIndex < activityModules.length) {
    // Adicionar vídeo se disponível
    if (videoIndex < videoModules.length) {
      result.push(videoModules[videoIndex]);
      videoIndex++;
    }

    // Adicionar atividade se disponível
    if (activityIndex < activityModules.length) {
      result.push(activityModules[activityIndex]);
      activityIndex++;
    }
  }

  // Verificar se a ordem está correta, se não estiver, usar a ordem corrigida
  const currentOrder = orderedModules.map(mod => mod.type);
  const expectedOrder = result.map(mod => mod.type);

  if (JSON.stringify(currentOrder) !== JSON.stringify(expectedOrder)) {
    console.warn('Ordem dos módulos corrigida para seguir padrão vídeo -> atividade');
    return result;
  }

  return orderedModules;
};