// src/modules/go-academy/pages/CoursesPage/CoursesPage.jsx
import React, { useEffect, useState } from 'react';
import './CoursesPage.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { tutoriais as localTutoriais } from '../../data/database';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import InstagramIcon from '../../components/InstagramIcon/InstagramIcon';
import { useAuth } from '../../contexts/AuthContext';
import { loadUserProgress } from '../../utils/progressUtils';
import { modulosGestaoTempo, modulosTutorial2, modulosTutorial3 } from '../../data/database';
import goPartsLogo from '../../images/GoParts_Logo_25Q1_principal_color.png';
import goPartsWhiteLogo from '../../images/GoParts_Logo_23Q1_reduzida_branco.png';
import mlIcon from '../../images/ml_icon.png';

function CoursesPage() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const [tutoriais, setTutoriais] = useState([]);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [tutorialProgress, setTutorialProgress] = useState({});

  useEffect(() => {
    document.title = 'Cursos - BarberAcademy';
  }, []);

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/curso-barbearia');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      navigate('/curso-barbearia');
    }
  };

  // Função para obter a imagem do tutorial baseada no ID
  const getTutorialImage = (tutorialId) => {
    switch (tutorialId) {
      case '1':
        return goPartsLogo;
      case '2':
        return mlIcon;
      case '3':
        // Logo da Shopee - usando URL pública
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/1200px-Shopee.svg.png';
      default:
        return goPartsLogo; // fallback
    }
  };

  useEffect(() => {
    // For now, always use local data to ensure all tutorials are shown
    setTutoriais(localTutoriais);
  }, []);

  // Carregar progresso dos tutoriais quando o usuário estiver logado e os tutoriais carregados
  useEffect(() => {
    let isMounted = true;
    let loadingTimeout;

    const loadTutorialProgress = async () => {
      if (!currentUser || tutoriais.length === 0 || !isMounted) return;

      // Debounce para evitar múltiplas chamadas rápidas
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }

      loadingTimeout = setTimeout(async () => {
        if (!isMounted) return;

        const progressData = {};
        // Processar tutoriais em lotes menores para evitar sobrecarga
        const batchSize = 2;
        for (let i = 0; i < tutoriais.length; i += batchSize) {
          const batch = tutoriais.slice(i, i + batchSize);
          
          await Promise.all(batch.map(async (tutorial) => {
            if (!isMounted) return;
            
            try {
              const progress = await loadUserProgress(currentUser.uid, tutorial.id);
              const totalModules = tutorial.id === '1' ? modulosGestaoTempo.length : tutorial.id === '2' ? modulosTutorial2.length : modulosTutorial3.length;
              if (isMounted) {
                progressData[tutorial.id] = {
                  completed: progress.completedModules.length,
                  total: totalModules
                };
              }
            } catch (error) {
              console.error(`Erro ao carregar progresso do tutorial ${tutorial.id}:`, error);
              const totalModules = tutorial.id === '1' ? modulosGestaoTempo.length : tutorial.id === '2' ? modulosTutorial2.length : modulosTutorial3.length;
              if (isMounted) {
                progressData[tutorial.id] = {
                  completed: 0,
                  total: totalModules
                };
              }
            }
          }));

          // Pequena pausa entre lotes para evitar sobrecarga
          if (i + batchSize < tutoriais.length && isMounted) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        
        if (isMounted) {
          setTutorialProgress(progressData);
        }
      }, 300); // Debounce de 300ms
    };

    loadTutorialProgress();

    return () => {
      isMounted = false;
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [currentUser, tutoriais]);

  return (
    <>
      <div className="go-academy-courses-page">
        <div className="go-academy-courses-container">
          <div className="go-academy-courses-header">
            <h1>Cursos</h1>
            <button
              className="go-academy-logout-btn"
              onClick={handleLogout}
              title="Sair"
            >
              <i className="fa fa-sign-out" aria-hidden="true"></i>
              Logout
            </button>
          </div>
          <div className="go-academy-courses-grid">
            {tutoriais.map((tutorial) => {
              const isComplete = tutorialProgress[tutorial.id]?.completed === tutorialProgress[tutorial.id]?.total;
              
              return (
                <Link
                  to={`/curso-barbearia/tutorial/${tutorial.id}`}
                  key={tutorial.id}
                  style={{ textDecoration: 'none' }}
                >
                  <div className={`go-academy-course-card ${isComplete ? 'go-academy-course-complete' : ''}`}>
                    <div className="go-academy-course-level">{tutorial.nivel || 'Intermediário'}</div>
                    <div className="go-academy-course-content">
                      <h3 className="go-academy-course-title">{tutorial.titulo}</h3>
                      <p className="go-academy-course-description">{tutorial.descricao}</p>
                      {tutorialProgress[tutorial.id] && (
                        <div className="go-academy-course-meta">
                          <div className="go-academy-course-duration">
                            <i className="fa fa-clock" aria-hidden="true"></i>
                            <span>{tutorialProgress[tutorial.id].completed}/{tutorialProgress[tutorial.id].total} módulos</span>
                          </div>
                          <button className="go-academy-course-btn">
                            {isComplete ? 'Revisar' : 'Continuar'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
              </Link>
              );
            })}
          </div>
        </div>
      </div>
      <InstagramIcon />
    </>
  );
}

export default CoursesPage;
