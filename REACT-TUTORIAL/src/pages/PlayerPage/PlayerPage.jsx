import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import './PlayerPage.css';
import WhatsAppIcon from '../../components/WhatsAppIcon/WhatsAppIcon';
import { Spinner } from '../../components/Spinner/Spinner';
import { useAuth } from '../../contexts/AuthContext';
import { saveUserProgress, loadUserProgress, validateAndOrderModules } from '../../utils/progressUtils';
import { modulosGestaoTempo, modulosTutorial2 } from '../../data/database';



const PlayerPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const iframeRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const modulo = location.state?.modulo;
  const [showNextButton, setShowNextButton] = useState(false);
  // tutorialId e moduleId podem vir da URL ou do objeto modulo
  const tutorialId = searchParams.get('tutorialId') || modulo?.tutorialId || 'default';
  const moduleId = modulo?.moduleId;

  // Função para encontrar o próximo módulo
  const getNextModule = (currentTutorialId, currentModuleId) => {
    const rawModules = currentTutorialId === '1' ? modulosGestaoTempo : modulosTutorial2;
    const modules = validateAndOrderModules(rawModules);
    const currentIndex = modules.findIndex(mod => mod.moduleId === currentModuleId);
    
    if (currentIndex === -1 || currentIndex === modules.length - 1) {
      return null; // Não há próximo módulo
    }
    
    return modules[currentIndex + 1];
  };

  // Estado para status do módulo
  const [status, setStatus] = useState('Estágio atual');
  const [pendingComplete, setPendingComplete] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);

  // Atualiza status ao montar e ao clicar em Próximo
  useEffect(() => {
    const loadInitialStatus = async () => {
      if (!tutorialId || !moduleId || !currentUser) return;

      try {
        const progress = await loadUserProgress(currentUser.uid, tutorialId);
        if (progress.moduleStatuses[moduleId] === 'completed') {
          setStatus('Concluído');
        } else {
          setStatus('Estágio atual');
        }
      } catch (error) {
        console.error('Erro ao carregar status:', error);
        setStatus('Estágio atual');
      }

      setPendingComplete(false);
      setVideoLoading(modulo?.type === 'video');

      // Fallback: hide spinner after 2 seconds if onLoad doesn't fire
      if (modulo?.type === 'video') {
        setTimeout(() => setVideoLoading(false), 2000);
      }
    };

    loadInitialStatus();
  }, [tutorialId, moduleId, modulo, currentUser]);

  // Função para salvar progresso no Firestore
  const saveProgress = async (setCompleted = false) => {
    if (!tutorialId || !moduleId || !currentUser) return;

    try {
      await saveUserProgress(currentUser.uid, tutorialId, moduleId, setCompleted);
      console.log('Progresso salvo para usuário:', currentUser.email);
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  };

  // Listener para detectar fim do vídeo YouTube
  useEffect(() => {
    if (!modulo) return;
    // Aguarda o iframe estar no DOM
    const interval = setInterval(() => {
      const iframe = document.getElementById('ytplayer');
      if (!iframe || !window.YT) return;
      clearInterval(interval);
      let player;
      function onPlayerStateChange(event) {
        // 0 = ended
        if (event.data === 0) {
          saveProgress();
          setShowNextButton(true);
        }
      }
      player = new window.YT.Player('ytplayer', {
        events: {
          'onStateChange': onPlayerStateChange
        }
      });
    }, 200);
    // Carrega API do YouTube se necessário
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [modulo, tutorialId, moduleId]);

  // Componente para atividades/quiz
  function QuizAtividade({ modulo, onComplete, status }) {
    const [answers, setAnswers] = useState(Array(modulo.questions.length).fill(null));
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleSelect = (qIdx, optIdx) => {
      if (submitted) return;
      const newAnswers = [...answers];
      newAnswers[qIdx] = optIdx;
      setAnswers(newAnswers);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      setLoading(true);
      // Simulate processing time
      setTimeout(() => {
        let correct = 0;
        modulo.questions.forEach((q, idx) => {
          if (answers[idx] === q.answer) correct++;
        });
        setScore(correct);
        setSubmitted(true);
        setLoading(false);
        // onComplete só é chamado ao clicar no botão Próximo
      }, 1000); // 1 second delay
    };

    const handleRetry = () => {
      setAnswers(Array(modulo.questions.length).fill(null));
      setSubmitted(false);
      setScore(0);
    };

    return (
      <form className="atividade-quiz" onSubmit={handleSubmit} style={{background:'#fff', padding:'1.5rem', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', marginTop:'1rem', width:'100%'}}>
        <h2 style={{marginBottom:'1.5rem'}}>Atividade</h2>
        {modulo.questions.map((q, idx) => (
          <div key={idx} style={{marginBottom:'1.2rem'}}>
            <div style={{fontWeight:600, marginBottom:6}}>{idx+1}. {q.question}</div>
            {q.options.map((opt, oIdx) => (
              <label key={oIdx} style={{display:'block', marginBottom:4, cursor:'pointer'}}>
                <input
                  type="radio"
                  name={`q${idx}`}
                  value={oIdx}
                  checked={answers[idx] === oIdx}
                  onChange={() => handleSelect(idx, oIdx)}
                  disabled={submitted}
                  style={{marginRight:8}}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}
        {!submitted && !loading && (
          <button type="submit" style={{background:'#212529', color:'#fff', border:'none', borderRadius:'6px', padding:'0.7rem 2rem', fontSize:'1rem', fontWeight:600, cursor:'pointer', marginTop:'1rem'}}>Enviar respostas</button>
        )}
        {loading && <Spinner />}
        {submitted && (
          <div style={{marginTop:'1.2rem', fontWeight:600, color: score === modulo.questions.length ? '#28a745' : '#e67e22'}}>
            {score === modulo.questions.length ? (
              <>
                Parabéns! Todas as respostas estão corretas.<br />
                <button type="button" style={{background:'#212529', color:'#fff', border:'none', borderRadius:'6px', padding:'0.7rem 2rem', fontSize:'1rem', fontWeight:600, cursor:'pointer', marginTop:'1.2rem'}} onClick={async () => { await onComplete(); navigate(`/tutorial/${tutorialId}`); }}>
                  Voltar aos módulos
                </button>
              </>
            ) : (
              <>
                Você acertou {score} de {modulo.questions.length}. Corrija e tente novamente!<br />
                <button type="button" style={{background:'#e67e22', color:'#fff', border:'none', borderRadius:'6px', padding:'0.7rem 2rem', fontSize:'1rem', fontWeight:600, cursor:'pointer', marginTop:'1.2rem'}} onClick={handleRetry}>
                  Tentar novamente
                </button>
              </>
            )}
          </div>
        )}
      </form>
    );
  }

  return (
    <>
      <div className="player-page">
      <header className="player-page-header">
        <div className="player-header-content">
          <div className="player-header-left">
            <img src="/gopartswhitelogo.png" alt="Logo GoParts" className="player-header-logo" />
          </div>
          <div className="player-header-center">
            <h1>TREINAMENTOS</h1>
          </div>
          <div className="player-header-right">
            <button
              className="logout-btn"
              onClick={() => {
                // Limpa todos os progressos salvos
                Object.keys(localStorage)
                  .filter(key => key.startsWith('progress_'))
                  .forEach(key => localStorage.removeItem(key));
                // Usar replace para impedir que o usuário volte pelas abas
                window.location.replace('/');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="player-container fade-in">
          <div className="video-box">
            {modulo ? (
              modulo.type === 'video' ? (
                videoLoading ? (
                  <Spinner />
                ) : (
                  <iframe
                    ref={iframeRef}
                    width="100%"
                    height="400"
                    src={
                      modulo.urlDoVideoEmbed.includes('enablejsapi=1')
                        ? modulo.urlDoVideoEmbed
                        : modulo.urlDoVideoEmbed + (modulo.urlDoVideoEmbed.includes('?') ? '&' : '?') + 'enablejsapi=1'
                    }
                    title={modulo.title}
                    frameBorder="0"
                    allowFullScreen
                    style={{ borderRadius: '12px', background: '#000' }}
                    id="ytplayer"
                    onLoad={() => setVideoLoading(false)}
                  ></iframe>
                )
              ) : (
                <QuizAtividade modulo={modulo} onComplete={async () => { 
                  await saveProgress(true); 
                  setStatus('completed'); 
                  setShowNextButton(true);
                  // Track completion
                  if (window.gtag) {
                    window.gtag('event', 'module_completed', {
                      event_category: 'engagement',
                      event_label: modulo.title,
                      tutorial_id: tutorialId
                    });
                  }
                }} status={status} />
              )
            ) : (
              <div id="video-player">Selecione um módulo para assistir</div>
            )}
          </div>
          <div className="video-info">
            <h1 id="videoTitle">{modulo ? modulo.title : 'Carregando...'}</h1>
            <p id="videoDesc" style={{color: (showNextButton || status === 'Concluído') ? '#28a745' : '#888', fontWeight: 500}}>
              Status: {(showNextButton || status === 'Concluído') ? 'Concluído' : status}
            </p>
            {showNextButton && modulo?.type === 'video' && (
              <button 
                type="button" 
                style={{
                  background:'#212529', 
                  color:'#fff', 
                  border:'none', 
                  borderRadius:'6px', 
                  padding:'0.7rem 2rem', 
                  fontSize:'1rem', 
                  fontWeight:600, 
                  cursor:'pointer', 
                  marginTop:'1.2rem'
                }} 
                onClick={async () => { 
                  await saveProgress(true); 
                  setStatus('completed'); 
                  navigate(`/tutorial/${tutorialId}`); 
                }}
              >
                Voltar aos módulos
              </button>
            )}
          </div>
        </div>
        {/* Botão próximo módulo removido - agora volta direto para módulos */}
      </main>
    </div>
    <WhatsAppIcon />
    </>
  );
}

export default PlayerPage;
