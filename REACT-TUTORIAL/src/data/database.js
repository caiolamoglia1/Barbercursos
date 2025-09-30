// database.js
// Exporte aqui seus arrays de dados, por exemplo:

export const tutoriais = [
  { id: '1', titulo: 'Tutorial 1', descricao: 'Acesse agora e confira nossas ofertas exclusivas. Clique aqui e conheça nosso produto completo. Entre na plataforma e aproveite os melhores preços. Descubra tudo sobre este item clicando aqui. Veja mais fotos e detalhes no link. Confira agora mesmo, estoque limitado. Aproveite esta oportunidade acessando já. Garanta o seu com apenas um clique. Saiba mais e compre com segurança aqui. Encontre tudo o que precisa neste anúncio.' },
  { id: '2', titulo: 'Tutorial 2', descricao: 'Descrição do tutorial 2' },
  { id: '3', titulo: 'Tutorial 3', descricao: 'Descubra novos conhecimentos e habilidades neste tutorial completo. Aprenda conceitos avançados e pratique com exercícios interativos. Desenvolva suas competências profissionais com conteúdo atualizado e metodologia comprovada.' },
];

export const modulosGestaoTempo = [
  // 1º módulo: vídeo
  { moduleId: 'mod1', type: 'video', title: 'Boas-vindas ao curso', status: 'A concluir', videoId: 'video-gestao-tempo', urlDoVideoEmbed: 'https://www.youtube.com/embed/Rj4rAuce0M0' },
  // 2º módulo: atividade
  { moduleId: 'mod2', type: 'atividade', title: 'Atividade: Princípios da gestão do tempo', status: 'A concluir',
    questions: [
      {
        question: 'Qual é o principal objetivo da gestão do tempo?',
        options: ['Aumentar o estresse', 'Melhorar a produtividade', 'Reduzir o tempo de lazer', 'Aumentar a quantidade de tarefas'],
        answer: 1
      },
      {
        question: 'Qual destas NÃO é uma técnica de gestão do tempo?',
        options: ['Pomodoro', 'Lei de Parkinson', 'Coma o Sapo', 'Procrastinação'],
        answer: 3
      }
    ]
  },
  // 3º módulo: vídeo
  { moduleId: 'mod3', type: 'video', title: 'Como a falta de gerenciamento de tempo afeta sua vida', status: 'A concluir', videoId: 'video-gestao-tempo', urlDoVideoEmbed: 'https://www.youtube.com/embed/Rj4rAuce0M0' },
  // 4º módulo: atividade
  { moduleId: 'mod4', type: 'atividade', title: 'Atividade: Benefícios do gerenciamento do tempo', status: 'A concluir',
    questions: [
      {
        question: 'Qual é um benefício direto de um bom gerenciamento do tempo?',
        options: ['Mais estresse', 'Menos produtividade', 'Mais tempo livre', 'Mais tarefas acumuladas'],
        answer: 2
      },
      {
        question: 'O que pode ser evitado com uma boa gestão do tempo?',
        options: ['Procrastinação', 'Organização', 'Foco', 'Resultados positivos'],
        answer: 0
      }
    ]
  },
  // 5º módulo: vídeo
  { moduleId: 'mod5', type: 'video', title: 'Técnicas e dicas para gerenciamento do tempo', status: 'A concluir', videoId: 'video-gestao-tempo', urlDoVideoEmbed: 'https://www.youtube.com/embed/Rj4rAuce0M0' },
  // 6º módulo: atividade
  { moduleId: 'mod6', type: 'atividade', title: 'Atividade: Técnicas de gerenciamento', status: 'A concluir',
    questions: [
      {
        question: 'O que é a Técnica Pomodoro?',
        options: ['Trabalhar sem pausas', 'Dividir o tempo em blocos com intervalos', 'Fazer tudo ao mesmo tempo', 'Evitar tarefas importantes'],
        answer: 1
      },
      {
        question: 'A Lei de Parkinson afirma que:',
        options: ['O trabalho se expande para preencher o tempo disponível', 'Devemos procrastinar sempre', 'Devemos evitar pausas', 'Devemos trabalhar sem planejamento'],
        answer: 0
      }
    ]
  },
  // 7º módulo: vídeo
  { moduleId: 'mod7', type: 'video', title: 'Técnicas e dicas para gerenciamento do tempo | Técnica Pomodoro', status: 'A concluir', videoId: 'video-gestao-tempo', urlDoVideoEmbed: 'https://www.youtube.com/embed/Rj4rAuce0M0' },
  // 8º módulo: atividade
  { moduleId: 'mod8', type: 'atividade', title: 'Atividade: Quadrantes de Stephen Covey', status: 'A concluir',
    questions: [
      {
        question: 'O que são os quadrantes de Stephen Covey?',
        options: ['Método de priorização de tarefas', 'Técnica de procrastinação', 'Ferramenta de distração', 'Método de relaxamento'],
        answer: 0
      },
      {
        question: 'Qual quadrante devemos evitar?',
        options: ['Importante e urgente', 'Não importante e urgente', 'Importante e não urgente', 'Não importante e não urgente'],
        answer: 3
      }
    ]
  },
  // 9º módulo: vídeo
  { moduleId: 'mod9', type: 'video', title: 'Técnicas e dicas para gerenciamento do tempo | Quadrantes de Stephen Covey', status: 'A concluir', videoId: 'video-gestao-tempo', urlDoVideoEmbed: 'https://www.youtube.com/embed/Rj4rAuce0M0' },
  // 10º módulo: atividade
  { moduleId: 'mod10', type: 'atividade', title: 'Atividade: Maus hábitos', status: 'A concluir',
    questions: [
      {
        question: 'Qual é um mau hábito que prejudica a gestão do tempo?',
        options: ['Planejar o dia', 'Fazer pausas', 'Procrastinar', 'Definir prioridades'],
        answer: 2
      },
      {
        question: 'Como podemos evitar maus hábitos?',
        options: ['Ignorando-os', 'Reconhecendo e mudando comportamentos', 'Fazendo mais tarefas', 'Trabalhando sem parar'],
        answer: 1
      }
    ]
  },
  // 11º módulo: vídeo
  { moduleId: 'mod11', type: 'video', title: 'Manter-se motivado em sua gestão do tempo', status: 'A concluir', videoId: 'video-gestao-tempo', urlDoVideoEmbed: 'https://www.youtube.com/embed/Rj4rAuce0M0' },
  // 12º módulo: atividade
  { moduleId: 'mod12', type: 'atividade', title: 'Atividade: Motivação', status: 'A concluir',
    questions: [
      {
        question: 'O que pode ajudar a manter a motivação?',
        options: ['Falta de objetivos', 'Definir metas claras', 'Procrastinação', 'Desorganização'],
        answer: 1
      },
      {
        question: 'Por que é importante celebrar pequenas conquistas?',
        options: ['Para perder tempo', 'Para se desmotivar', 'Para manter o foco e a motivação', 'Para procrastinar'],
        answer: 2
      }
    ]
  },
  // 13º módulo: vídeo
  { moduleId: 'mod13', type: 'video', title: 'Exercícios', status: 'A concluir', videoId: 'video-gestao-tempo', urlDoVideoEmbed: 'https://www.youtube.com/embed/Rj4rAuce0M0' },
  // 14º módulo: atividade
  { moduleId: 'mod14', type: 'atividade', title: 'Atividade: Encerramento', status: 'A concluir',
    questions: [
      {
        question: 'O que você aprendeu sobre gestão do tempo?',
        options: ['Nada', 'A importância de planejar', 'A procrastinar mais', 'A evitar organização'],
        answer: 1
      },
      {
        question: 'Qual será seu próximo passo?',
        options: ['Não fazer nada', 'Aplicar as técnicas aprendidas', 'Esquecer o curso', 'Procrastinar'],
        answer: 1
      }
    ]
  }
];

export const modulosTutorial2 = [
  // 1º módulo: vídeo
  { moduleId: 'mod1', type: 'video', title: 'Boas-vindas ao curso', status: 'A concluir', videoId: 'video-tutorial2', urlDoVideoEmbed: 'https://www.youtube.com/embed/1_gvNAa0qyM' },
  // 2º módulo: atividade
  { moduleId: 'mod2', type: 'atividade', title: 'Atividade: Princípios da gestão do tempo', status: 'A concluir',
    questions: [
      {
        question: 'Qual é o principal objetivo da gestão do tempo?',
        options: ['Aumentar o estresse', 'Melhorar a produtividade', 'Reduzir o tempo de lazer', 'Aumentar a quantidade de tarefas'],
        answer: 1
      },
      {
        question: 'Qual destas NÃO é uma técnica de gestão do tempo?',
        options: ['Pomodoro', 'Lei de Parkinson', 'Coma o Sapo', 'Procrastinação'],
        answer: 3
      }
    ]
  },
  // 3º módulo: vídeo
  { moduleId: 'mod3', type: 'video', title: 'Como a falta de gerenciamento de tempo afeta sua vida', status: 'A concluir', videoId: 'video-tutorial2', urlDoVideoEmbed: 'https://www.youtube.com/embed/1_gvNAa0qyM' },
  // 4º módulo: atividade
  { moduleId: 'mod4', type: 'atividade', title: 'Atividade: Benefícios do gerenciamento do tempo', status: 'A concluir',
    questions: [
      {
        question: 'Qual é um benefício direto de um bom gerenciamento do tempo?',
        options: ['Mais estresse', 'Menos produtividade', 'Mais tempo livre', 'Mais tarefas acumuladas'],
        answer: 2
      },
      {
        question: 'O que pode ser evitado com uma boa gestão do tempo?',
        options: ['Procrastinação', 'Organização', 'Foco', 'Resultados positivos'],
        answer: 0
      }
    ]
  },
  // 5º módulo: vídeo
  { moduleId: 'mod5', type: 'video', title: 'Técnicas e dicas para gerenciamento do tempo', status: 'A concluir', videoId: 'video-tutorial2', urlDoVideoEmbed: 'https://www.youtube.com/embed/1_gvNAa0qyM' },
  // 6º módulo: atividade
  { moduleId: 'mod6', type: 'atividade', title: 'Atividade: Técnicas de gerenciamento', status: 'A concluir',
    questions: [
      {
        question: 'O que é a Técnica Pomodoro?',
        options: ['Trabalhar sem pausas', 'Dividir o tempo em blocos com intervalos', 'Fazer tudo ao mesmo tempo', 'Evitar tarefas importantes'],
        answer: 1
      },
      {
        question: 'A Lei de Parkinson afirma que:',
        options: ['O trabalho se expande para preencher o tempo disponível', 'Devemos procrastinar sempre', 'Devemos evitar pausas', 'Devemos trabalhar sem planejamento'],
        answer: 0
      }
    ]
  },
  // 7º módulo: vídeo
  { moduleId: 'mod7', type: 'video', title: 'Técnicas e dicas para gerenciamento do tempo | Técnica Pomodoro', status: 'A concluir', videoId: 'video-tutorial2', urlDoVideoEmbed: 'https://www.youtube.com/embed/1_gvNAa0qyM' },
  // 8º módulo: atividade
  { moduleId: 'mod8', type: 'atividade', title: 'Atividade: Quadrantes de Stephen Covey', status: 'A concluir',
    questions: [
      {
        question: 'O que são os quadrantes de Stephen Covey?',
        options: ['Método de priorização de tarefas', 'Técnica de procrastinação', 'Ferramenta de distração', 'Método de relaxamento'],
        answer: 0
      },
      {
        question: 'Qual quadrante devemos evitar?',
        options: ['Importante e urgente', 'Não importante e urgente', 'Importante e não urgente', 'Não importante e não urgente'],
        answer: 3
      }
    ]
  },
  // 9º módulo: vídeo
  { moduleId: 'mod9', type: 'video', title: 'Técnicas e dicas para gerenciamento do tempo | Quadrantes de Stephen Covey', status: 'A concluir', videoId: 'video-tutorial2', urlDoVideoEmbed: 'https://www.youtube.com/embed/1_gvNAa0qyM' },
  // 10º módulo: atividade
  { moduleId: 'mod10', type: 'atividade', title: 'Atividade: Maus hábitos', status: 'A concluir',
    questions: [
      {
        question: 'Qual é um mau hábito que prejudica a gestão do tempo?',
        options: ['Planejar o dia', 'Fazer pausas', 'Procrastinar', 'Definir prioridades'],
        answer: 2
      },
      {
        question: 'Como podemos evitar maus hábitos?',
        options: ['Ignorando-os', 'Reconhecendo e mudando comportamentos', 'Fazendo mais tarefas', 'Trabalhando sem parar'],
        answer: 1
      }
    ]
  },
  // 11º módulo: vídeo
  { moduleId: 'mod11', type: 'video', title: 'Manter-se motivado em sua gestão do tempo', status: 'A concluir', videoId: 'video-tutorial2', urlDoVideoEmbed: 'https://www.youtube.com/embed/1_gvNAa0qyM' },
  // 12º módulo: atividade
  { moduleId: 'mod12', type: 'atividade', title: 'Atividade: Motivação', status: 'A concluir',
    questions: [
      {
        question: 'O que pode ajudar a manter a motivação?',
        options: ['Falta de objetivos', 'Definir metas claras', 'Procrastinação', 'Desorganização'],
        answer: 1
      },
      {
        question: 'Por que é importante celebrar pequenas conquistas?',
        options: ['Para perder tempo', 'Para se desmotivar', 'Para manter o foco e a motivação', 'Para procrastinar'],
        answer: 2
      }
    ]
  },
  // 13º módulo: vídeo
  { moduleId: 'mod13', type: 'video', title: 'Exercícios', status: 'A concluir', videoId: 'video-tutorial2', urlDoVideoEmbed: 'https://www.youtube.com/embed/1_gvNAa0qyM' },
  // 14º módulo: atividade
  { moduleId: 'mod14', type: 'atividade', title: 'Atividade: Encerramento', status: 'A concluir',
    questions: [
      {
        question: 'O que você aprendeu sobre gestão do tempo?',
        options: ['Nada', 'A importância de planejar', 'A procrastinar mais', 'A evitar organização'],
        answer: 1
      },
      {
        question: 'Qual será seu próximo passo?',
        options: ['Não fazer nada', 'Aplicar as técnicas aprendidas', 'Esquecer o curso', 'Procrastinar'],
        answer: 1
      }
    ]
  }
];


export const modulosTutorial3 = [
  // 1º módulo: vídeo
  { moduleId: 'mod1', type: 'video', title: 'Introdução ao Tutorial 3', status: 'A concluir', videoId: 'video-tutorial3', urlDoVideoEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  // 2º módulo: atividade
  { moduleId: 'mod2', type: 'atividade', title: 'Atividade: Conceitos Básicos', status: 'A concluir',
    questions: [
      {
        question: 'Qual é o objetivo principal deste tutorial?',
        options: ['Aprender conceitos avançados', 'Desenvolver novas habilidades', 'Praticar exercícios', 'Todas as opções acima'],
        answer: 3
      },
      {
        question: 'O que é importante para o aprendizado?',
        options: ['Prática constante', 'Teoria apenas', 'Memorização', 'Sorte'],
        answer: 0
      }
    ]
  },
  // 3º módulo: vídeo
  { moduleId: 'mod3', type: 'video', title: 'Fundamentos e Princípios', status: 'A concluir', videoId: 'video-tutorial3', urlDoVideoEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  // 4º módulo: atividade
  { moduleId: 'mod4', type: 'atividade', title: 'Atividade: Aplicação Prática', status: 'A concluir',
    questions: [
      {
        question: 'Como aplicar os conceitos aprendidos?',
        options: ['Na teoria apenas', 'Na prática diária', 'Esquecendo-os', 'Ignorando-os'],
        answer: 1
      },
      {
        question: 'Qual é a importância da prática?',
        options: ['Nenhuma', 'Reforça o aprendizado', 'Causa confusão', 'Perde tempo'],
        answer: 1
      }
    ]
  },
  // 5º módulo: vídeo
  { moduleId: 'mod5', type: 'video', title: 'Exemplos e Casos Práticos', status: 'A concluir', videoId: 'video-tutorial3', urlDoVideoEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  // 6º módulo: atividade
  { moduleId: 'mod6', type: 'atividade', title: 'Atividade: Análise de Casos', status: 'A concluir',
    questions: [
      {
        question: 'O que os casos práticos ajudam a desenvolver?',
        options: ['Confusão', 'Compreensão aplicada', 'Memorização', 'Esquecimento'],
        answer: 1
      },
      {
        question: 'Como analisar um caso prático?',
        options: ['Ignorando detalhes', 'Observando padrões e aplicando conceitos', 'Copiando respostas', 'Adivinhando'],
        answer: 1
      }
    ]
  },
  // 7º módulo: vídeo
  { moduleId: 'mod7', type: 'video', title: 'Ferramentas e Recursos', status: 'A concluir', videoId: 'video-tutorial3', urlDoVideoEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  // 8º módulo: atividade
  { moduleId: 'mod8', type: 'atividade', title: 'Atividade: Utilização de Ferramentas', status: 'A concluir',
    questions: [
      {
        question: 'Por que as ferramentas são importantes?',
        options: ['Complicam o processo', 'Facilitam e otimizam o trabalho', 'São desnecessárias', 'Causam atrasos'],
        answer: 1
      },
      {
        question: 'Como escolher a ferramenta certa?',
        options: ['Aleatoriamente', 'Baseado nas necessidades específicas', 'A mais cara', 'A mais simples sempre'],
        answer: 1
      }
    ]
  },
  // 9º módulo: vídeo
  { moduleId: 'mod9', type: 'video', title: 'Tendências e Inovações', status: 'A concluir', videoId: 'video-tutorial3', urlDoVideoEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  // 10º módulo: atividade
  { moduleId: 'mod10', type: 'atividade', title: 'Atividade: Inovação e Tendências', status: 'A concluir',
    questions: [
      {
        question: 'Por que acompanhar tendências?',
        options: ['Para ficar desatualizado', 'Para se manter competitivo', 'Para complicar processos', 'Para ignorar mudanças'],
        answer: 1
      },
      {
        question: 'Como identificar uma tendência relevante?',
        options: ['Ignorando o mercado', 'Analisando impacto e aplicabilidade', 'Seguindo modas passageiras', 'Copiando concorrentes cegamente'],
        answer: 1
      }
    ]
  },
  // 11º módulo: vídeo
  { moduleId: 'mod11', type: 'video', title: 'Conclusão e Próximos Passos', status: 'A concluir', videoId: 'video-tutorial3', urlDoVideoEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  // 12º módulo: atividade
  { moduleId: 'mod12', type: 'atividade', title: 'Atividade: Planejamento de Implementação', status: 'A concluir',
    questions: [
      {
        question: 'Qual é o próximo passo após o curso?',
        options: ['Esquecer tudo', 'Aplicar os conhecimentos na prática', 'Não fazer nada', 'Esperar mais cursos'],
        answer: 1
      },
      {
        question: 'Como manter o aprendizado contínuo?',
        options: ['Parando de estudar', 'Buscando novas oportunidades de aprendizado', 'Ignorando atualizações', 'Repetindo o mesmo sempre'],
        answer: 1
      }
    ]
  }
];
