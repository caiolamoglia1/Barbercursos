import React, { useEffect, useState } from 'react';
import './CoursesPage.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { tutoriais as localTutoriais } from '../../data/database';
import { useLocation, Link } from 'react-router-dom';
import WhatsAppIcon from '../../components/WhatsAppIcon/WhatsAppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { loadUserProgress } from '../../utils/progressUtils';
import { modulosGestaoTempo, modulosTutorial2, modulosTutorial3 } from '../../data/database';


function CoursesPage() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const [tutoriais, setTutoriais] = useState([]);
  const { currentUser, logout } = useAuth();
  const [tutorialProgress, setTutorialProgress] = useState({});

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      console.log('Iniciando logout...');
      
      // Limpar progresso local
      Object.keys(localStorage)
        .filter(key => key.startsWith('progress_'))
        .forEach(key => localStorage.removeItem(key));
      
      console.log('Progresso local limpo, fazendo logout do Firebase...');
      
      // Fazer logout do Firebase
      await logout();
      
      console.log('Logout do Firebase concluído, redirecionando...');
      
      // Redirecionar para login
      window.location.replace('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, redirecionar
      window.location.replace('/');
    }
  };

  // Função para obter a imagem do tutorial baseada no ID
  const getTutorialImage = (tutorialId) => {
    switch (tutorialId) {
      case '1':
        return '/gopartbrasil_logo.jpeg';
      case '2':
        return '/ML.svg';
      case '3':
        return '/icons8-comprador-240.png';
      default:
        return '/ML.svg'; // fallback
    }
  };

  useEffect(() => {
    // For now, always use local data to ensure all tutorials are shown
    setTutoriais(localTutoriais);
  }, []);

  // Carregar progresso dos tutoriais quando o usuário estiver logado e os tutoriais carregados
  useEffect(() => {
    const loadTutorialProgress = async () => {
      if (!currentUser || tutoriais.length === 0) return;

      const progressData = {};
      for (const tutorial of tutoriais) {
        try {
          const progress = await loadUserProgress(currentUser.uid, tutorial.id);
          const totalModules = tutorial.id === '1' ? modulosGestaoTempo.length : tutorial.id === '2' ? modulosTutorial2.length : modulosTutorial3.length;
          progressData[tutorial.id] = {
            completed: progress.completedModules.length,
            total: totalModules
          };
        } catch (error) {
          console.error(`Erro ao carregar progresso do tutorial ${tutorial.id}:`, error);
          const totalModules = tutorial.id === '1' ? modulosGestaoTempo.length : tutorial.id === '2' ? modulosTutorial2.length : modulosTutorial3.length;
          progressData[tutorial.id] = {
            completed: 0,
            total: totalModules
          };
        }
      }
      setTutorialProgress(progressData);
    };

    loadTutorialProgress();
  }, [currentUser, tutoriais]);

  return (
    <>
      <header className="courses-page-header">
        <div className="courses-header-content">
          <div className="courses-header-left">
            <img src="/gopartswhitelogo.png" alt="Logo GoParts" className="courses-header-logo" />
          </div>
          <div className="courses-header-center">
            <h1>TREINAMENTOS</h1>
          </div>
          <div className="courses-header-right">
            {!isLoginPage && (
              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>
      <main>
        <div className="courses-container">
          <h2>Cursos</h2>
          <div className="course-list">
            {tutoriais.map((tutorial) => (
              <Link
                to={`/tutorial/${tutorial.id}`}
                key={tutorial.id}
                className="course-list-link"
              >
                <div className="course-list-item">
                  <div className="course-header">
                    <div className="course-img-placeholder">
                      <img src={getTutorialImage(tutorial.id)} alt="Imagem do tutorial" />
                    </div>
                    {tutorialProgress[tutorial.id] && (
                      <div className="course-progress">
                        <i className="fa fa-chart-line" aria-hidden="true"></i>
                        <div className="progress-text">
                          <span className="progress-number">{tutorialProgress[tutorial.id].completed}</span>
                          <span className="progress-label">de {tutorialProgress[tutorial.id].total} concluídos</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="course-content">
                    <h3>{tutorial.titulo}</h3>
                    <p>{tutorial.descricao}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <WhatsAppIcon />
    </>
  );
}

export default CoursesPage;
