// src/modules/go-academy/pages/ModulesPage/ModulesPage.jsx
import React, { useEffect, useState } from 'react';
import './ModulesPage.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { modulosGestaoTempo, modulosTutorial2, modulosTutorial3 } from '../../data/database';
import { useLocation, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import InstagramIcon from '../../components/InstagramIcon/InstagramIcon';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { loadUserProgress, validateAndOrderModules } from '../../utils/progressUtils';
import goPartsWhiteLogo from '../../images/GoParts_Logo_23Q1_reduzida_branco.png';

const ModulesPage = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const { currentUser, logout } = useAuth();
  const [completedModules, setCompletedModules] = useState([]);
  // Suporte a múltiplos tutoriais no futuro
  const tutorialId = id || 'default';
  const [modules, setModules] = useState([]);

  useEffect(() => {
    document.title = 'Módulos do Curso - BarberAcademy';
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchModules = async () => {
      if (tutorialId === 'default' || !isMounted) return;
      
      try {
        // Usar dados locais diretamente para evitar muitas requisições Firebase
        const rawModules = tutorialId === '1' ? modulosGestaoTempo : tutorialId === '2' ? modulosTutorial2 : modulosTutorial3;
        if (isMounted) {
          setModules(validateAndOrderModules(rawModules));
        }
      } catch (error) {
        console.error('Error loading modules:', error);
        if (isMounted) {
          const fallbackModules = tutorialId === '1' ? modulosGestaoTempo : tutorialId === '2' ? modulosTutorial2 : modulosTutorial3;
          setModules(fallbackModules);
        }
      }
    };
    
    fetchModules();
    
    return () => {
      isMounted = false;
    };
  }, [tutorialId]);

  const [statusMap, setStatusMap] = useState({});
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  
  useEffect(() => {
    let isMounted = true;

    const loadUserProgressData = async () => {
      if (!currentUser || tutorialId === 'default' || !isMounted) {
        setIsLoadingProgress(false);
        return;
      }

      try {
        console.log('Carregando progresso do usuário...');
        const progress = await loadUserProgress(currentUser.uid, tutorialId);
        if (isMounted) {
          console.log('Progresso carregado:', progress);
          setCompletedModules(progress.completedModules);
          setStatusMap(progress.moduleStatuses);
          setIsLoadingProgress(false);
        }
      } catch (error) {
        console.error('Erro ao carregar progresso:', error);
        if (isMounted) {
          setCompletedModules([]);
          setStatusMap({});
          setIsLoadingProgress(false);
        }
      }
    };

    loadUserProgressData();

    return () => {
      isMounted = false;
    };
  }, [currentUser, tutorialId]);

  // Scroll automático para o módulo atual quando a página carrega
  useEffect(() => {
    if (modules.length > 0) {
      // Encontrar o primeiro módulo não completado (próximo a ser assistido)
      const nextModuleIndex = modules.findIndex((modulo, idx) => {
        if (idx === 0) return !completedModules.includes(modulo.moduleId);
        const prevModule = modules[idx - 1];
        const isPrevCompleted = completedModules.includes(prevModule.moduleId);
        return isPrevCompleted && !completedModules.includes(modulo.moduleId);
      });

      // Se encontrou um módulo, fazer scroll para ele
      if (nextModuleIndex !== -1) {
        setTimeout(() => {
          const moduleElement = document.querySelector(`[data-module-id="${modules[nextModuleIndex].moduleId}"]`);
          if (moduleElement) {
            moduleElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 500); // Pequeno delay para garantir que os elementos estão renderizados
      }
    }
  }, [modules, completedModules]);

  return (
    <>
      <Sidebar />
      <main>
        <div className="go-academy-modules-page">
          <button
            className="go-academy-back-to-courses-btn"
            onClick={() => navigate('/curso-barbearia/cursos')}
            title="Voltar aos cursos"
            style={{ marginBottom: '1rem' }}
          >
            <i className="fa fa-arrow-left" aria-hidden="true"></i>
            Cursos
          </button>
          <h2>Módulos do Curso</h2>
          {isLoadingProgress ? (
            <div style={{textAlign: 'center', padding: '2rem'}}>
              <p>Carregando progresso...</p>
            </div>
          ) : (
            <>
              <div style={{marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef'}}>
                <p style={{margin: 0, fontSize: '1.1rem', fontWeight: 500, color: '#495057'}}>
                  Progresso: <span style={{color: '#28a745', fontWeight: 600}}>{completedModules.length}</span> de <span style={{fontWeight: 600}}>{modules.length}</span> módulos concluídos
                </p>
                <div style={{width: '100%', height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px', marginTop: '0.5rem'}}>
                  <div 
                    style={{
                      width: `${modules.length > 0 ? (completedModules.length / modules.length) * 100 : 0}%`, 
                      height: '100%', 
                      backgroundColor: '#28a745', 
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                </div>
              </div>
          <ul className="go-academy-modules-list">
            {modules.map((modulo, idx) => {
              const isCompleted = completedModules.includes(modulo.moduleId);
              
              // Primeiro módulo sempre desbloqueado
              let isLocked = false;
              if (idx > 0) {
                const prevModule = modules[idx - 1];
                isLocked = !completedModules.includes(prevModule.moduleId);
              }
              
              // LÓGICA DE EXIBIÇÃO: Mostrar apenas módulos completados + próximo disponível
              // Não mostrar módulos futuros que ainda estão bloqueados
              if (idx > 0 && isLocked) {
                // Verifica se este é o PRÓXIMO módulo bloqueado (logo após o último desbloqueado)
                const prevModule = modules[idx - 1];
                const isPrevUnlocked = idx === 1 || completedModules.includes(modules[idx - 2].moduleId);
                const isPrevLocked = !completedModules.includes(prevModule.moduleId);
                
                // Só mostra se for o primeiro módulo bloqueado na sequência
                if (!isPrevUnlocked || !isPrevLocked) {
                  return null; // Não mostra módulos muito à frente
                }
              }
              
              // Status do módulo
              let status = 'Estágio atual';
              if (isLocked) {
                status = 'A concluir';
              } else if (isCompleted) {
                status = 'Concluído';
              }
              
              if (isLocked) {
                return (
                  <li key={modulo.moduleId} className="go-academy-module-item go-academy-locked" data-module-id={modulo.moduleId}>
                    <i className="fa fa-lock" aria-label="Bloqueado" style={{marginRight:8}}></i>
                    <span>{modulo.title}</span>
                    <span style={{marginLeft:8, fontSize:'0.95em', color:'#888'}}>{status}</span>
                  </li>
                );
              }
              
              return (
                <li
                  key={modulo.moduleId}
                  className={`go-academy-module-item go-academy-clickable${isCompleted ? ' go-academy-completed' : ''}`}
                  onClick={() => navigate(`/curso-barbearia/player?tutorialId=${tutorialId}`, { state: { modulo: { ...modulo, tutorialId } } })}
                  tabIndex={0}
                  role="button"
                  style={{ cursor: 'pointer' }}
                  data-module-id={modulo.moduleId}
                >
                  <div className="go-academy-module-content">
                    <span>{modulo.title}</span>
                    <span style={{marginLeft:8, fontSize:'0.95em', color: isCompleted ? '#28a745' : '#888'}}>{status}</span>
                  </div>
                  {isCompleted ? <i className="fa fa-check-circle go-academy-module-check-icon"></i> : null}
                </li>
              );
            })}
          </ul>
            </>
          )}
        </div>
      </main>
      <InstagramIcon />
    </>
  );
};

export default ModulesPage;
