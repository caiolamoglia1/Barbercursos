// src/modules/go-academy/pages/PlayerPage/PlayerPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import './PlayerPage.css';
import InstagramIcon from '../../components/InstagramIcon/InstagramIcon';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Spinner } from '../../components/Spinner/Spinner';
import { useAuth } from '../../contexts/AuthContext';
import { saveUserProgress, loadUserProgress, validateAndOrderModules } from '../../utils/progressUtils';
import { modulosGestaoTempo, modulosTutorial2 } from '../../data/database';
import goPartsWhiteLogo from '../../images/GoParts_Logo_23Q1_reduzida_branco.png';
import SecureVideoPlayer from '../../components/SecureVideoPlayer';
import SubscriptionRequired from '../../components/SubscriptionRequired/SubscriptionRequired';
import { checkUserSubscription } from '../../services/SubscriptionService';

const PlayerPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const iframeRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const modulo = location.state?.modulo;
  const [showNextButton, setShowNextButton] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(null); // null = carregando, true/false = resultado
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  
  // tutorialId e moduleId podem vir da URL ou do objeto modulo
  const tutorialId = searchParams.get('tutorialId') || modulo?.tutorialId || 'default';
  const moduleId = modulo?.moduleId;

  useEffect(() => {
    document.title = `${modulo?.title || 'Aula'} - BarberAcademy`;
  }, [modulo?.title]);

  // Verifica assinatura do usuário
  useEffect(() => {
    const checkSubscription = async () => {
      if (!currentUser) {
        setHasSubscription(false);
        setSubscriptionLoading(false);
        return;
      }

      try {
        const { hasSubscription: hasSub } = await checkUserSubscription(currentUser.uid);
        setHasSubscription(hasSub);
      } catch (error) {
        console.error('Erro ao verificar assinatura:', error);
        setHasSubscription(false);
      } finally {
        setSubscriptionLoading(false);
      }
    };

    checkSubscription();
  }, [currentUser]);

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
  const [quizLoading, setQuizLoading] = useState(false);

  // Reseta showNextButton quando o módulo muda
  useEffect(() => {
    setShowNextButton(false);
  }, [moduleId]);

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
    };

    loadInitialStatus();
  }, [tutorialId, moduleId, modulo, currentUser]);

  // Função para salvar progresso no Firestore
  const saveProgress = async (setCompleted = false) => {
    if (!tutorialId || !moduleId || !currentUser) return;

    try {
      await saveUserProgress(currentUser.uid, tutorialId, moduleId, setCompleted, currentUser.email);
      console.log('Progresso salvo para usuário:', currentUser.email);
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  };

  // NOTA: A detecção do fim do vídeo agora está dentro do SecureVideoPlayer
  // através do callback onVideoEnd. O código abaixo foi substituído.
  /*
  // Listener para detectar fim do vídeo YouTube - ANTIGO
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
  */


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
      <form className="go-academy-atividade-quiz" onSubmit={handleSubmit}>
        <h2>Atividade</h2>
        {modulo.questions.map((q, idx) => (
          <div key={idx} className="go-academy-quiz-question">
            <div className="go-academy-quiz-question-text">{idx+1}. {q.question}</div>
            {q.options.map((opt, oIdx) => (
              <label key={oIdx} className="go-academy-quiz-option">
                <input
                  type="radio"
                  name={`q${idx}`}
                  value={oIdx}
                  checked={answers[idx] === oIdx}
                  onChange={() => handleSelect(idx, oIdx)}
                  disabled={submitted}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}
        {!submitted && !loading && (
          <button type="submit" className="go-academy-submit-btn">Enviar respostas</button>
        )}
        {loading && <Spinner />}
        {submitted && (
          <div className={`go-academy-quiz-result ${score === modulo.questions.length ? 'go-academy-quiz-success' : 'go-academy-quiz-retry'}`}>
            {score === modulo.questions.length ? (
              <>
                Parabéns! Todas as respostas estão corretas.<br />
                <div className="go-academy-action-buttons">
                  {(() => {
                    const nextModule = getNextModule(tutorialId, moduleId);
                    return nextModule ? (
                      <button 
                        type="button" 
                        className="go-academy-next-btn"
                        onClick={async () => { 
                          await onComplete();
                          navigate(`/curso-barbearia/player?tutorialId=${tutorialId}`, { 
                            state: { modulo: { ...nextModule, tutorialId } } 
                          });
                        }}
                      >
                        Próxima Atividade
                        <i className="fa fa-arrow-right" style={{marginLeft: '0.5rem'}}></i>
                      </button>
                    ) : null;
                  })()}
                  <button 
                    type="button" 
                    className="go-academy-back-btn" 
                    onClick={async () => { 
                      await onComplete(); 
                      navigate(`/curso-barbearia/tutorial/${tutorialId}`); 
                    }}
                  >
                    <i className="fa fa-arrow-left" style={{marginRight: '0.5rem'}}></i>
                    Voltar aos módulos
                  </button>
                </div>
              </>
            ) : (
              <>
                Você acertou {score} de {modulo.questions.length}. Corrija e tente novamente!<br />
                <button type="button" className="go-academy-retry-btn" onClick={handleRetry}>
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
      <Sidebar />
      <div className="go-academy-player-page">
      {subscriptionLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <Spinner />
        </div>
      ) : !hasSubscription ? (
        <SubscriptionRequired courseName={modulo?.title} />
      ) : (
      <main>
        <button
          className="go-academy-back-to-courses-btn"
          onClick={() => navigate(`/curso-barbearia/tutorial/${tutorialId}`)}
          title="Voltar para a trilha do tutorial"
        >
          <i className="fa fa-arrow-left" aria-hidden="true"></i>
          Voltar
        </button>
        <div className="go-academy-player-container go-academy-fade-in">
          <div className="go-academy-video-box">
            {modulo ? (
              modulo.type === 'video' ? (
                <SecureVideoPlayer
                  module={modulo}
                  userId={currentUser?.uid || currentUser?.email || 'anonymous'}
                  onVideoLoaded={(data) => {
                    console.log('Vídeo carregado:', data);
                    // Track video view
                    if (window.gtag) {
                      window.gtag('event', 'video_view', {
                        event_category: 'engagement',
                        event_label: modulo.title,
                        tutorial_id: tutorialId
                      });
                    }
                  }}
                  onVideoEnd={async (data) => {
                    console.log('Vídeo terminou:', data);
                    // Salva progresso como COMPLETO quando o vídeo termina
                    await saveProgress(true);
                    // Atualiza o status local
                    setStatus('Concluído');
                    // Mostra botão de próxima atividade
                    setShowNextButton(true);
                    // Track video completion
                    if (window.gtag) {
                      window.gtag('event', 'video_completed', {
                        event_category: 'engagement',
                        event_label: modulo.title,
                        tutorial_id: tutorialId
                      });
                    }
                  }}
                  onError={(error) => {
                    console.error('Erro ao carregar vídeo:', error);
                  }}
                />
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
              <div className="go-academy-video-player">Selecione um módulo para assistir</div>
            )}
          </div>
          <div className="go-academy-video-info">
            <h1 id="videoTitle">{modulo ? modulo.title : 'Carregando...'}</h1>
            <p id="videoDesc" style={{color: (showNextButton || status === 'Concluído') ? '#28a745' : '#888', fontWeight: 500}}>
              Status: {(showNextButton || status === 'Concluído') ? 'Concluído' : status}
            </p>
            {modulo?.type === 'video' && (
              <div className="go-academy-action-buttons">
                {(() => {
                  const nextModule = getNextModule(tutorialId, moduleId);
                  return nextModule ? (
                    <button 
                      type="button" 
                      className="go-academy-next-btn"
                      onClick={async () => { 
                        await saveProgress(true); 
                        setStatus('completed');
                        navigate(`/curso-barbearia/player?tutorialId=${tutorialId}`, { 
                          state: { modulo: { ...nextModule, tutorialId } } 
                        });
                      }}
                    >
                      Próxima Atividade
                      <i className="fa fa-arrow-right" style={{marginLeft: '0.5rem'}}></i>
                    </button>
                  ) : null;
                })()}
                <button 
                  type="button" 
                  className="go-academy-back-btn"
                  onClick={async () => { 
                    await saveProgress(true); 
                    setStatus('completed'); 
                    navigate(`/curso-barbearia/tutorial/${tutorialId}`); 
                  }}
                >
                  <i className="fa fa-arrow-left" style={{marginRight: '0.5rem'}}></i>
                  Voltar aos módulos
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Botão próximo módulo removido - agora volta direto para módulos */}
      </main>
      )}
    </div>
    <InstagramIcon />
    </>
  );
}

export default PlayerPage;
