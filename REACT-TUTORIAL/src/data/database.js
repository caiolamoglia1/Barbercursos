// src/modules/go-academy/data/database.js
// Base de dados dos tutoriais e módulos - BarberAcademy

export const tutoriais = [
  { 
    id: '1', 
    titulo: 'Fundamentos da Barbearia', 
    descricao: 'Técnicas básicas essenciais para todo barbeiro iniciante. Domine os cortes clássicos e fundamentos da profissão.', 
    nivel: 'Iniciante',
    duracao: '10 aulas'
  },
  { 
    id: '2', 
    titulo: 'Técnicas Avançadas de Corte', 
    descricao: 'Cortes modernos e tendências. Aprenda fade, undercut, pompadour e designs criativos.', 
    nivel: 'Intermediário',
    duracao: '8 aulas'
  },
  { 
    id: '3', 
    titulo: 'Barba e Finalização Profissional', 
    descricao: 'Técnicas de navalha, contorno perfeito e atendimento VIP. Eleve seu serviço ao próximo nível.', 
    nivel: 'Avançado',
    duracao: '6 aulas'
  },
];

// ============================================
// TUTORIAL 1: FUNDAMENTOS DA BARBEARIA
// ============================================
export const modulosGestaoTempo = [
  // Módulo 1 - Vídeo
  { 
    moduleId: 'mod1', 
    type: 'video', 
    title: 'Apresentação: Bem-vindo à Barbearia Profissional', 
    status: 'A concluir', 
    videoId: 'video-fundamentos-01', 
    urlDoVideoEmbed: 'https://www.youtube.com/watch?v=2PuFyjAs7JA',
    duracao: '8 min',
    ferramentas: 'Nenhuma',
    nivel: 'Iniciante',
    descricao: 'Introdução ao curso e visão geral da carreira de barbeiro profissional.'
  },
  // Módulo 2 - Atividade
  { 
    moduleId: 'mod2', 
    type: 'atividade', 
    title: 'Atividade: Conhecendo seu Kit Profissional', 
    status: 'A concluir',
    questions: [
      {
        question: 'Qual é a ferramenta MAIS importante para um barbeiro iniciante?',
        options: ['Tesoura de corte', 'Máquina profissional', 'Navalha', 'Pente fino'],
        answer: 1
      },
      {
        question: 'Com que frequência você deve limpar e desinfetar suas ferramentas?',
        options: ['Uma vez por semana', 'Após cada cliente', 'No fim do dia', 'Quando lembrar'],
        answer: 1
      },
      {
        question: 'Qual a voltagem ideal para máquinas profissionais no Brasil?',
        options: ['110V', '220V', 'Bivolt', 'Depende da região'],
        answer: 2
      }
    ]
  },
  // Módulo 3 - Vídeo
  { 
    moduleId: 'mod3', 
    type: 'video', 
    title: 'Técnica Básica: Tesoura e Pente', 
    status: 'A concluir', 
    videoId: 'video-fundamentos-02', 
    urlDoVideoEmbed: 'https://www.youtube.com/watch?v=2PuFyjAs7JA',
    duracao: '15 min',
    ferramentas: 'Tesoura de corte, pente de corte',
    nivel: 'Iniciante',
    descricao: 'Aprenda a posição correta das mãos e movimentos básicos com tesoura e pente.'
  },
  // Módulo 4 - Atividade
  { 
    moduleId: 'mod4', 
    type: 'atividade', 
    title: 'Atividade: Posicionamento e Ergonomia', 
    status: 'A concluir',
    questions: [
      {
        question: 'Qual o ângulo correto para segurar a tesoura de corte?',
        options: ['45 graus', '90 graus', '30 graus', '180 graus'],
        answer: 0
      },
      {
        question: 'Por que a ergonomia é importante para barbeiros?',
        options: ['Para parecer profissional', 'Para evitar lesões e fadiga', 'Para cortar mais rápido', 'Não é importante'],
        answer: 1
      }
    ]
  },
  // Módulo 5 - Vídeo
  { 
    moduleId: 'mod5', 
    type: 'video', 
    title: 'Corte Clássico: Máquina na Régua', 
    status: 'A concluir', 
    videoId: 'video-fundamentos-03', 
    urlDoVideoEmbed: 'https://www.youtube.com/watch?v=2PuFyjAs7JA',
    duracao: '12 min',
    ferramentas: 'Máquina, pentes guia (3mm, 6mm, 9mm)',
    nivel: 'Iniciante',
    descricao: 'Domine o corte tradicional com máquina usando diferentes pentes guia.'
  },
  // Módulo 6 - Atividade
  { 
    moduleId: 'mod6', 
    type: 'atividade', 
    title: 'Atividade: Numeração de Pentes', 
    status: 'A concluir',
    questions: [
      {
        question: 'Qual pente deixa o cabelo com 9mm?',
        options: ['Pente #1', 'Pente #2', 'Pente #3', 'Pente #4'],
        answer: 2
      },
      {
        question: 'Para um degradê suave, qual a diferença ideal entre os pentes?',
        options: ['1 número', '2 números', '3 números', 'Qualquer um'],
        answer: 0
      }
    ]
  },
  // Módulo 7 - Vídeo
  { 
    moduleId: 'mod7', 
    type: 'video', 
    title: 'Degradê Básico: Fundamentos do Fade', 
    status: 'A concluir', 
    videoId: 'video-fundamentos-04', 
    urlDoVideoEmbed: 'https://www.youtube.com/watch?v=2PuFyjAs7JA',
    duracao: '18 min',
    ferramentas: 'Máquina com pentes 1, 2, 3',
    nivel: 'Iniciante',
    descricao: 'Aprenda a criar transições suaves entre comprimentos diferentes.'
  },
  // Módulo 8 - Atividade
  { 
    moduleId: 'mod8', 
    type: 'atividade', 
    title: 'Atividade: Teoria do Degradê', 
    status: 'A concluir',
    questions: [
      {
        question: 'Qual a direção correta para iniciar um degradê?',
        options: ['De cima para baixo', 'De baixo para cima', 'Das laterais para o centro', 'Do centro para fora'],
        answer: 1
      },
      {
        question: 'O que significa "fade" na barbearia?',
        options: ['Corte reto', 'Transição gradual', 'Cabelo raspado', 'Corte longo'],
        answer: 1
      }
    ]
  },
  // Módulo 9 - Vídeo
  { 
    moduleId: 'mod9', 
    type: 'video', 
    title: 'Finalização: Contorno e Acabamento', 
    status: 'A concluir', 
    videoId: 'video-fundamentos-05', 
    urlDoVideoEmbed: 'https://www.youtube.com/watch?v=2PuFyjAs7JA',
    duracao: '10 min',
    ferramentas: 'Máquina de acabamento, navalha',
    nivel: 'Iniciante',
    descricao: 'Técnicas para dar um acabamento profissional e limpo.'
  },
  // Módulo 10 - Atividade Final
  { 
    moduleId: 'mod10', 
    type: 'atividade', 
    title: 'Avaliação Final: Fundamentos', 
    status: 'A concluir',
    questions: [
      {
        question: 'Qual ferramenta é melhor para contornos precisos?',
        options: ['Máquina de corte', 'Tesoura', 'Máquina de acabamento', 'Pente'],
        answer: 2
      },
      {
        question: 'O que você deve fazer SEMPRE antes de iniciar um corte?',
        options: ['Lavar as mãos', 'Consultar o cliente', 'Ligar a máquina', 'Cobrir o cliente'],
        answer: 1
      },
      {
        question: 'Quantos minutos em média leva um corte básico profissional?',
        options: ['5-10 min', '15-25 min', '30-45 min', '1 hora'],
        answer: 1
      }
    ]
  },
];

// ============================================
// TUTORIAL 2: TÉCNICAS AVANÇADAS DE CORTE
// ============================================
export const modulosTutorial2 = [
  // Módulo 1 - Vídeo
  { 
    moduleId: 'adv1', 
    type: 'video', 
    title: 'Fade Profissional: Low, Mid e High', 
    status: 'A concluir', 
    videoId: 'video-avancado-01', 
    urlDoVideoEmbed: 'https://www.youtube.com/watch?v=2PuFyjAs7JA',
    duracao: '20 min',
    ferramentas: 'Máquina profissional, pentes 0.5 a 3',
    nivel: 'Intermediário',
    descricao: 'Domine os três tipos de fade e quando aplicar cada um.'
  },
  // Módulo 2 - Atividade
  { 
    moduleId: 'adv2', 
    type: 'atividade', 
    title: 'Atividade: Tipos de Fade', 
    status: 'A concluir',
    questions: [
      {
        question: 'Onde começa um "Low Fade"?',
        options: ['No topo da cabeça', 'Próximo à orelha', 'Bem baixo, perto da nuca', 'No meio da cabeça'],
        answer: 2
      },
      {
        question: 'Qual fade é mais versátil para diferentes estilos?',
        options: ['Low Fade', 'Mid Fade', 'High Fade', 'Skin Fade'],
        answer: 1
      }
    ]
  },
  // Módulo 3 - Vídeo
  { 
    moduleId: 'adv3', 
    type: 'video', 
    title: 'Undercut Moderno e Variações', 
    status: 'A concluir', 
    videoId: 'video-avancado-02', 
    urlDoVideoEmbed: 'https://www.youtube.com/watch?v=2PuFyjAs7JA',
    duracao: '16 min',
    ferramentas: 'Tesoura, máquina, pente',
    nivel: 'Intermediário',
    descricao: 'Crie undercuts impecáveis com diferentes comprimentos no topo.'
  },
  // Módulo 4 - Atividade
  { 
    moduleId: 'adv4', 
    type: 'atividade', 
    title: 'Atividade: Estrutura do Undercut', 
    status: 'A concluir',
    questions: [
      {
        question: 'O que caracteriza um undercut?',
        options: ['Cabelo todo do mesmo tamanho', 'Laterais curtas e topo longo', 'Degradê suave', 'Cabelo raspado'],
        answer: 1
      },
      {
        question: 'Qual produto é ideal para finalizar um undercut com volume?',
        options: ['Gel', 'Pomada', 'Cera', 'Spray fixador'],
        answer: 2
      }
    ]
  },
  // Módulo 5 - Vídeo
  { 
    moduleId: 'adv5', 
    type: 'video', 
    title: 'Pompadour Clássico e Contemporâneo', 
    status: 'A concluir', 
    videoId: 'video-avancado-03', 
    urlDoVideoEmbed: 'https://www.youtube.com/watch?v=2PuFyjAs7JA',
    duracao: '22 min',
    ferramentas: 'Tesoura, secador, escova',
    nivel: 'Intermediário',
    descricao: 'Aprenda o corte pompadour desde a base até a finalização.'
  },
  // Módulo 6 - Atividade
  { 
    moduleId: 'adv6', 
    type: 'atividade', 
    title: 'Atividade: Estilos Vintage', 
    status: 'A concluir',
    questions: [
      {
        question: 'Qual a característica principal do pompadour?',
        options: ['Cabelo para trás', 'Volume frontal elevado', 'Laterais raspadas', 'Franja reta'],
        answer: 1
      },
      {
        question: 'Que tipo de cabelo se adapta melhor ao pompadour?',
        options: ['Muito crespo', 'Liso ou ondulado', 'Muito fino', 'Cacheado apertado'],
        answer: 1
      }
    ]
  },
  // Módulo 7 - Vídeo
  { 
    moduleId: 'adv7', 
    type: 'video', 
    title: 'Designs e Riscos Criativos', 
    status: 'A concluir', 
    videoId: 'video-avancado-04', 
    urlDoVideoEmbed: 'https://www.youtube.com/watch?v=2PuFyjAs7JA',
    duracao: '14 min',
    ferramentas: 'Máquina de acabamento, caneta de desenho',
    nivel: 'Intermediário',
    descricao: 'Técnicas para criar designs e riscos perfeitos.'
  },
  // Módulo 8 - Avaliação Final
  { 
    moduleId: 'adv8', 
    type: 'atividade', 
    title: 'Avaliação Final: Técnicas Avançadas', 
    status: 'A concluir',
    questions: [
      {
        question: 'Qual a ferramenta ideal para fazer riscos?',
        options: ['Tesoura', 'Máquina comum', 'Máquina de acabamento', 'Navalha'],
        answer: 2
      },
      {
        question: 'Como evitar que um risco "cresça" rápido?',
        options: ['Fazer mais fundo', 'Usar navalha', 'Orientar o cliente sobre manutenção', 'Não tem como'],
        answer: 2
      },
      {
        question: 'Qual corte exige mais habilidade com tesoura?',
        options: ['Fade', 'Undercut', 'Pompadour', 'Máquina na régua'],
        answer: 2
      }
    ]
  },
];

// ============================================
// TUTORIAL 3: BARBA E FINALIZAÇÃO PROFISSIONAL
// ============================================
export const modulosTutorial3 = [
  // Módulo 1 - Vídeo
  { 
    moduleId: 'barba1', 
    type: 'video', 
    title: 'Anatomia da Barba: Crescimento e Estrutura', 
    status: 'A concluir', 
    videoId: 'video-barba-01', 
    urlDoVideoEmbed: 'https://www.youtube.com/watch?v=2PuFyjAs7JA',
    duracao: '10 min',
    ferramentas: 'Nenhuma',
    nivel: 'Avançado',
    descricao: 'Entenda como a barba cresce e como trabalhar com diferentes tipos.'
  },
  // Módulo 2 - Atividade
  { 
    moduleId: 'barba2', 
    type: 'atividade', 
    title: 'Atividade: Tipos de Barba', 
    status: 'A concluir',
    questions: [
      {
        question: 'Qual tipo de barba combina com rosto redondo?',
        options: ['Barba cheia e redonda', 'Barba pontuda/angular', 'Cavanhaque', 'Bigode fino'],
        answer: 1
      },
      {
        question: 'Quantos dias em média para a barba crescer após o corte?',
        options: ['2-3 dias', '7-10 dias', '15-20 dias', '30 dias'],
        answer: 2
      }
    ]
  },
  // Módulo 3 - Vídeo
  { 
    moduleId: 'barba3', 
    type: 'video', 
    title: 'Técnica de Navalha: Segurança e Precisão', 
    status: 'A concluir', 
    videoId: 'video-barba-02', 
    urlDoVideoEmbed: 'https://www.youtube.com/watch?v=2PuFyjAs7JA',
    duracao: '18 min',
    ferramentas: 'Navalha profissional, espuma de barbear',
    nivel: 'Avançado',
    descricao: 'Aprenda a usar a navalha com segurança e criar contornos perfeitos.'
  },
  // Módulo 4 - Atividade
  { 
    moduleId: 'barba4', 
    type: 'atividade', 
    title: 'Atividade: Segurança com Navalha', 
    status: 'A concluir',
    questions: [
      {
        question: 'Qual o ângulo correto da navalha na pele?',
        options: ['90 graus', '30 graus', '45 graus', '10 graus'],
        answer: 1
      },
      {
        question: 'O que fazer se cortar o cliente acidentalmente?',
        options: ['Ignorar', 'Parar e aplicar antisséptico', 'Continuar rápido', 'Pedir desculpas só'],
        answer: 1
      }
    ]
  },
  // Módulo 5 - Vídeo
  { 
    moduleId: 'barba5', 
    type: 'video', 
    title: 'Contorno Perfeito e Degradê de Barba', 
    status: 'A concluir', 
    videoId: 'video-barba-03', 
    urlDoVideoEmbed: 'https://www.youtube.com/watch?v=2PuFyjAs7JA',
    duracao: '16 min',
    ferramentas: 'Máquina, navalha, pente',
    nivel: 'Avançado',
    descricao: 'Crie linhas precisas e degradês suaves na barba.'
  },
  // Módulo 6 - Avaliação Final
  { 
    moduleId: 'barba6', 
    type: 'atividade', 
    title: 'Avaliação Final: Mestre da Barba', 
    status: 'A concluir',
    questions: [
      {
        question: 'Qual produto usar para amaciar a barba antes do corte?',
        options: ['Shampoo comum', 'Óleo de barba', 'Gel', 'Nada'],
        answer: 1
      },
      {
        question: 'Como cobrar por um serviço de barba profissional?',
        options: ['Metade do corte', 'Mesmo preço do corte', 'O dobro do corte', 'Depende da barba'],
        answer: 3
      },
      {
        question: 'Qual o diferencial de um atendimento VIP?',
        options: ['Preço mais caro', 'Toalha quente, massagem, produtos premium', 'Corte mais rápido', 'Mais produtos no cabelo'],
        answer: 1
      }
    ]
  },
];
