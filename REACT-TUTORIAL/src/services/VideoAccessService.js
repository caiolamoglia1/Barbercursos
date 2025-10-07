// src/modules/go-academy/services/VideoAccessService.js
// Serviço para gerenciar acesso seguro aos vídeos não listados do YouTube

export class VideoAccessService {
  /**
   * Verifica se o usuário tem permissão para acessar o vídeo
   * @param {string} videoId - ID do vídeo
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} - Resultado da verificação
   */
  static async checkVideoAccess(videoId, userId) {
    try {
      // MODO DE DESENVOLVIMENTO: Sempre permite acesso se o usuário está autenticado
      // Em produção, substitua por uma chamada real à sua API
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      if (isDevelopment) {
        // Simula delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verifica se o usuário está autenticado (tem um ID)
        if (!userId) {
          return { 
            hasAccess: false, 
            reason: 'Usuário não autenticado' 
          };
        }

        // Em desenvolvimento, permite acesso
        return { 
          hasAccess: true, 
          data: {
            videoId,
            userId,
            permissions: ['view', 'log'],
            accessedAt: new Date().toISOString()
          }
        };
      }

      // EM PRODUÇÃO: Descomente e configure esta parte
      /*
      const response = await fetch(`/api/videos/${videoId}/check-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        return { hasAccess: false, reason: 'Acesso negado' };
      }

      const data = await response.json();
      return { hasAccess: true, data };
      */

      return { hasAccess: true };

    } catch (error) {
      console.error('Erro ao verificar acesso ao vídeo:', error);
      return { 
        hasAccess: false, 
        reason: 'Erro ao verificar permissões' 
      };
    }
  }

  /**
   * Registra que o usuário visualizou o vídeo
   * @param {string} videoId - ID do vídeo
   * @param {string} userId - ID do usuário
   * @param {Object} metadata - Metadados adicionais
   */
  static async logVideoView(videoId, userId, metadata = {}) {
    try {
      const logEntry = {
        videoId,
        userId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ...metadata
      };

      // Salva log localmente (para desenvolvimento)
      const logs = JSON.parse(localStorage.getItem('videoAccessLogs') || '[]');
      logs.push(logEntry);
      
      // Mantém apenas os últimos 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('videoAccessLogs', JSON.stringify(logs));
      
      console.log('[VideoAccess] Log registrado:', logEntry);

      // EM PRODUÇÃO: Descomente para enviar para sua API
      /*
      await fetch('/api/videos/log-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(logEntry)
      });
      */

    } catch (error) {
      console.error('Erro ao registrar visualização:', error);
    }
  }

  /**
   * Converte URL do YouTube para formato embed
   * @param {string} url - URL original do YouTube
   * @returns {string|null} - URL no formato embed ou null se inválida
   */
  static convertToEmbedUrl(url) {
    if (!url || typeof url !== 'string') {
      console.warn('URL inválida fornecida:', url);
      return null;
    }

    try {
      // Remove espaços em branco
      url = url.trim();

      // URL do tipo: https://www.youtube.com/watch?v=VIDEO_ID
      if (url.includes('watch?v=')) {
        const videoId = url.split('watch?v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&showinfo=0`;
      }
      
      // URL do tipo: https://youtu.be/VIDEO_ID
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&showinfo=0`;
      }
      
      // Já é uma URL embed
      if (url.includes('/embed/')) {
        // Adiciona parâmetros de segurança se ainda não tiver
        if (!url.includes('enablejsapi=1')) {
          const separator = url.includes('?') ? '&' : '?';
          return `${url}${separator}enablejsapi=1&rel=0&modestbranding=1&showinfo=0`;
        }
        return url;
      }
      
      console.warn('Formato de URL não reconhecido:', url);
      return null;

    } catch (error) {
      console.error('Erro ao converter URL do YouTube:', error);
      return null;
    }
  }

  /**
   * Valida se a URL é do YouTube
   * @param {string} url - URL para validar
   * @returns {boolean} - Se é uma URL válida do YouTube
   */
  static isValidYouTubeUrl(url) {
    if (!url || typeof url !== 'string') return false;
    
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  }

  /**
   * Obtém logs de visualização salvos localmente
   * @param {string} userId - ID do usuário (opcional)
   * @returns {Array} - Array de logs
   */
  static getVideoLogs(userId = null) {
    try {
      const logs = JSON.parse(localStorage.getItem('videoAccessLogs') || '[]');
      
      if (userId) {
        return logs.filter(log => log.userId === userId);
      }
      
      return logs;
    } catch (error) {
      console.error('Erro ao obter logs:', error);
      return [];
    }
  }

  /**
   * Limpa logs antigos (opcional)
   */
  static clearOldLogs(daysToKeep = 30) {
    try {
      const logs = JSON.parse(localStorage.getItem('videoAccessLogs') || '[]');
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const filteredLogs = logs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate > cutoffDate;
      });
      
      localStorage.setItem('videoAccessLogs', JSON.stringify(filteredLogs));
      console.log(`[VideoAccess] ${logs.length - filteredLogs.length} logs antigos removidos`);
    } catch (error) {
      console.error('Erro ao limpar logs:', error);
    }
  }
}

export default VideoAccessService;
