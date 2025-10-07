// src/components/SecureVideoPlayer.jsx
import React from 'react';

const SecureVideoPlayer = ({ module }) => {
  // Suporta tanto videoUrl quanto urlDoVideoEmbed
  const videoUrl = module?.videoUrl || module?.urlDoVideoEmbed;

  console.log('SecureVideoPlayer - Video URL:', videoUrl);

  // Extrai o ID do vídeo
  const getVideoId = (url) => {
    if (!url) return null;
    
    url = url.trim();
    console.log('Extraindo ID de:', url);
    
    // Formato: youtu.be/VIDEO_ID
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
      console.log('ID extraído:', id);
      return id;
    } 
    
    // Formato: youtube.com/watch?v=VIDEO_ID
    if (url.includes('youtube.com/watch') && url.includes('v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      console.log('ID extraído:', id);
      return id;
    } 
    
    // Formato: youtube.com/embed/VIDEO_ID
    if (url.includes('youtube.com/embed/')) {
      const id = url.split('embed/')[1]?.split('?')[0]?.split('&')[0];
      console.log('ID extraído:', id);
      return id;
    }
    
    // Tenta extrair qualquer string de 11 caracteres
    const match = url.match(/[a-zA-Z0-9_-]{11}/);
    if (match) {
      console.log('ID extraído (regex):', match[0]);
      return match[0];
    }
    
    console.error('Não foi possível extrair ID');
    return null;
  };

  const videoId = getVideoId(videoUrl);

  if (!videoUrl) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '500px',
        backgroundColor: '#1a1a1a',
        color: '#d4af37',
        borderRadius: '8px',
        fontSize: '18px'
      }}>
        ❌ URL do vídeo não encontrada
      </div>
    );
  }

  if (!videoId) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '500px',
        backgroundColor: '#1a1a1a',
        color: '#d4af37',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>
          ❌ Não foi possível extrair o ID do vídeo
        </div>
        <div style={{ fontSize: '12px', color: '#999' }}>
          URL: {videoUrl}
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

  console.log('Embed URL:', embedUrl);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%',
      paddingTop: '56.25%',
      backgroundColor: '#000',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
    }}>
      <iframe
        src={embedUrl}
        title={module?.title || 'Vídeo'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none'
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};

export default SecureVideoPlayer;

