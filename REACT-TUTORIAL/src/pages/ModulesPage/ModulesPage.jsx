import React, { useEffect, useState } from 'react';
import './ModulesPage.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { modulosGestaoTempo, modulosTutorial2, modulosTutorial3 } from '../../data/database';
import { useLocation, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import WhatsAppIcon from '../../components/WhatsAppIcon/WhatsAppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { loadUserProgress, validateAndOrderModules } from '../../utils/progressUtils';



const ModulesPage = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [completedModules, setCompletedModules] = useState([]);
  // Suporte a múltiplos tutoriais no futuro
  const tutorialId = id || 'default';
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const q = query(collection(db, 'modules'), where('tutorialId', '==', tutorialId));
        const querySnapshot = await getDocs(q);
        const modulesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (modulesData.length > 0) {
          setModules(validateAndOrderModules(modulesData));
        } else {
          // Fallback to local data
          const rawModules = tutorialId === '1' ? modulosGestaoTempo : tutorialId === '2' ? modulosTutorial2 : modulosTutorial3;
          setModules(validateAndOrderModules(rawModules));
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
        // Fallback to local data
        setModules(tutorialId === '1' ? modulosGestaoTempo : tutorialId === '2' ? modulosTutorial2 : modulosTutorial3);
      }
    };
    if (tutorialId !== 'default') {
      fetchModules();
    }
  }, [tutorialId]);

  const [statusMap, setStatusMap] = useState({});
  useEffect(() => {
    const loadUserProgressData = async () => {
      if (!currentUser || tutorialId === 'default') return;

      try {
        const progress = await loadUserProgress(currentUser.uid, tutorialId);
        setCompletedModules(progress.completedModules);
        setStatusMap(progress.moduleStatuses);
      } catch (error) {
        console.error('Erro ao carregar progresso:', error);
        setCompletedModules([]);
        setStatusMap({});
      }
    };

    loadUserProgressData();

    // Recarregar progresso quando a página ganha foco novamente
    const handleFocus = () => {
      loadUserProgressData();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
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
      <header className="modules-page-header">
        <div className="modules-header-content">
          <div className="modules-header-left">
            <img src="/gopartswhitelogo.png" alt="Logo GoParts" className="modules-header-logo" />
          </div>
          <div className="modules-header-center">
            <h1>TREINAMENTOS</h1>
          </div>
          <div className="modules-header-right">
            {!isLoginPage && (
              <button
                className="logout-btn"
                onClick={() => {
                  Object.keys(localStorage)
                    .filter(key => key.startsWith('progress_'))
                    .forEach(key => localStorage.removeItem(key));
                  // Usar replace para impedir que o usuário volte pelas abas
                  window.location.replace('/');
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>
      <main>
        <div className="modules-page">
          <button
            className="back-to-courses-btn"
            onClick={() => navigate('/cursos')}
            title="Voltar aos cursos"
            style={{ marginBottom: '1rem' }}
          >
            <i className="fa fa-arrow-left" aria-hidden="true"></i>
            Cursos
          </button>
          <h2>Módulos do Curso</h2>
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
          <ul className="modules-list">
            {modules.map((modulo, idx) => {
              const isCompleted = completedModules.includes(modulo.moduleId);
              let isLocked = false;
              if (idx === 0) isLocked = false;
              else {
                const prevModule = modules[idx - 1];
                isLocked = !completedModules.includes(prevModule.moduleId);
              }
              // Status: se bloqueado, sempre 'A concluir'. Se concluído, 'Concluído'. Se desbloqueado e não concluído, 'Estágio atual'.
              let status = 'Estágio atual';
              if (isLocked) {
                status = 'A concluir';
              } else if (isCompleted) {
                status = 'Concluído';
              }
              if (isLocked) {
                return (
                  <li key={modulo.moduleId} className="module-item locked" data-module-id={modulo.moduleId}>
                    <i className="fa fa-lock" aria-label="Bloqueado" style={{marginRight:8}}></i>
                    <span>{modulo.title}</span>
                    <span style={{marginLeft:8, fontSize:'0.95em', color:'#888'}}>{status}</span>
                  </li>
                );
              }
              return (
                <li
                  key={modulo.moduleId}
                  className={`module-item clickable${isCompleted ? ' completed' : ''}`}
                  onClick={() => navigate(`/player?tutorialId=${tutorialId}`, { state: { modulo: { ...modulo, tutorialId } } })}
                  tabIndex={0}
                  role="button"
                  style={{ cursor: 'pointer' }}
                  data-module-id={modulo.moduleId}
                >
                  <div className="module-content">
                    <span>{modulo.title}</span>
                    <span style={{marginLeft:8, fontSize:'0.95em', color: isCompleted ? '#28a745' : '#888'}}>{status}</span>
                  </div>
                  {isCompleted ? <i className="fa fa-check-circle module-check-icon"></i> : null}
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <WhatsAppIcon />
    </>
  );
};

export default ModulesPage;
