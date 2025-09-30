// Teste da função validateAndOrderModules
function validateAndOrderModules(modules) {
  if (!Array.isArray(modules) || modules.length === 0) {
    return modules;
  }

  const orderedModules = [...modules];
  let videoModules = orderedModules.filter(mod => mod.type === 'video');
  let activityModules = orderedModules.filter(mod => mod.type === 'atividade');

  const result = [];
  let videoIndex = 0;
  let activityIndex = 0;

  while (videoIndex < videoModules.length || activityIndex < activityModules.length) {
    if (videoIndex < videoModules.length) {
      result.push(videoModules[videoIndex]);
      videoIndex++;
    }

    if (activityIndex < activityModules.length) {
      result.push(activityModules[activityIndex]);
      activityIndex++;
    }
  }

  return result;
}

// Teste com dados corretos
const correctModules = [
  { moduleId: 'mod1', type: 'video', title: 'Vídeo 1' },
  { moduleId: 'mod2', type: 'atividade', title: 'Atividade 1' },
  { moduleId: 'mod3', type: 'video', title: 'Vídeo 2' },
  { moduleId: 'mod4', type: 'atividade', title: 'Atividade 2' }
];

console.log('Teste com módulos já ordenados:');
console.log('Original:', correctModules.map(m => m.type));
console.log('Validado:', validateAndOrderModules(correctModules).map(m => m.type));

// Teste com dados desordenados
const wrongModules = [
  { moduleId: 'mod1', type: 'atividade', title: 'Atividade 1' },
  { moduleId: 'mod2', type: 'video', title: 'Vídeo 1' },
  { moduleId: 'mod3', type: 'atividade', title: 'Atividade 2' },
  { moduleId: 'mod4', type: 'video', title: 'Vídeo 2' }
];

console.log('\nTeste com módulos desordenados:');
console.log('Original:', wrongModules.map(m => m.type));
console.log('Validado:', validateAndOrderModules(wrongModules).map(m => m.type));
