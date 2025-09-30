
// Simulação de banco de dados de vídeos
const videos = [
  {
    id: 'video-produtividade',
    titulo: 'Produtividade no Trabalho',
    descricao: 'Aprenda técnicas para aumentar sua produtividade e eficiência no ambiente profissional.',
    urlDoVideoEmbed: 'https://www.youtube.com/embed/4sk_wXH8wR4',
    ytId: '4sk_wXH8wR4'
  },
  {
    id: 'video-gestao-tempo',
    titulo: 'Gestão de Tempo',
    descricao: 'Domine métodos para organizar melhor seu tempo e alcançar seus objetivos.',
    urlDoVideoEmbed: 'https://www.youtube.com/embed/4sk_wXH8wR4',
    ytId: '4sk_wXH8wR4'
  },
  {
    id: 'video-comunicacao',
    titulo: 'Comunicação Assertiva',
    descricao: 'Melhore sua comunicação interpessoal e profissional com técnicas práticas.',
    urlDoVideoEmbed: 'https://www.youtube.com/embed/4sk_wXH8wR4',
    ytId: '4sk_wXH8wR4'
  }
];

function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

let player;


function createYouTubePlayer() {
  const videoId = getParam('videoId');
  const video = videos.find(v => v.id === videoId);
  const title = document.getElementById('videoTitle');
  const desc = document.getElementById('videoDesc');
  const error = document.getElementById('errorMsg');

  if (!videoId || !video) {
    title.style.display = 'none';
    desc.style.display = 'none';
    error.style.display = 'block';
    error.innerText = 'Vídeo não encontrado.';
    return;
  }

  title.innerText = video.titulo;
  desc.innerText = video.descricao;

  player = new YT.Player('video-player', {
    height: '500',
    width: '900',
    videoId: video.ytId,
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

function onYouTubeIframeAPIReady() {
  createYouTubePlayer();
}

// Caso a API já esteja disponível antes do DOMContentLoaded
if (window.YT && window.YT.Player) {
  createYouTubePlayer();
} else {
  window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    const form = document.getElementById('question-form');
    if (form) {
      form.style.display = 'block';
    }
  }
}
