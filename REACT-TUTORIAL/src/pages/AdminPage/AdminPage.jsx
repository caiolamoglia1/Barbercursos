import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, doc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Header from '../../components/Header/Header';
import './AdminPage.css';

function AdminPage() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ 
    email: '', 
    password: '', 
    displayName: '', 
    plan: 'basic' 
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    usersWithoutPlan: 0,
    totalModulesCompleted: 0,
    planStats: {
      basic: { active: 0, inactive: 0 },
      pro: { active: 0, inactive: 0 },
      elite: { active: 0, inactive: 0 }
    }
  });
  const [users, setUsers] = useState([]);

  const isAdmin = currentUser?.email === 'admin@gmail.com';

  const loadAdminData = async () => {
    try {
      console.log('🔄 Carregando dados do admin...');
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      console.log('📊 Usuários encontrados:', usersSnapshot.size);
      const usersData = [];
      let activeUsersCount = 0;
      let usersWithoutPlanCount = 0;
      let totalModulesCount = 0;
      const planStats = {
        basic: { active: 0, inactive: 0 },
        pro: { active: 0, inactive: 0 },
        elite: { active: 0, inactive: 0 }
      };

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const subsSnapshot = await getDocs(collection(db, 'users', userDoc.id, 'subscriptions'));
        const subscriptions = subsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const progressSnapshot = await getDocs(collection(db, 'users', userDoc.id, 'progress'));
        
        let userModulesCompleted = 0;
        progressSnapshot.docs.forEach(progressDoc => {
          const progressData = progressDoc.data();
          if (progressData.modules) {
            Object.values(progressData.modules).forEach(module => {
              if (module.status === 'completed') userModulesCompleted++;
            });
          }
        });
        
        totalModulesCount += userModulesCompleted;
        if (subscriptions.some(sub => sub.active)) activeUsersCount++;
        if (subscriptions.length === 0) usersWithoutPlanCount++;
        
        subscriptions.forEach(sub => {
          const planId = sub.id.toLowerCase();
          if (planStats[planId]) {
            if (sub.active) planStats[planId].active++;
            else planStats[planId].inactive++;
          }
        });

        usersData.push({
          id: userDoc.id,
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role,
          subscriptions,
          progressCount: progressSnapshot.size,
          modulesCompleted: userModulesCompleted,
          lastLogin: userData.lastLogin?.toDate?.() || null,
          createdAt: userData.createdAt?.toDate?.() || null
        });
      }

      setStats({ 
        totalUsers: usersSnapshot.size, 
        activeUsers: activeUsersCount, 
        usersWithoutPlan: usersWithoutPlanCount, 
        totalModulesCompleted: totalModulesCount, 
        planStats 
      });
      
      console.log('📈 Estatísticas atualizadas:', {
        totalUsers: usersSnapshot.size,
        activeUsers: activeUsersCount,
        usersWithoutPlan: usersWithoutPlanCount,
        totalModulesCompleted: totalModulesCount,
        planStats
      });
      
      usersData.sort((a, b) => {
        if (!a.lastLogin) return 1;
        if (!b.lastLogin) return -1;
        return b.lastLogin - a.lastLogin;
      });
      
      setUsers(usersData);
      setLoading(false);
      console.log('✅ Dados carregados com sucesso!', { totalUsers: usersSnapshot.size, stats: planStats });
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔍 Verificando admin...', { currentUser: currentUser?.email, isAdmin });
    if (isAdmin) {
      console.log('✅ É admin! Carregando dados...');
      loadAdminData();
    } else {
      console.log('❌ Não é admin');
    }
  }, [isAdmin, currentUser]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!newUser.email || !newUser.password) {
      alert('Email e senha são obrigatórios!');
      return;
    }

    try {
      setLoading(true);
      
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, 'users', userId), {
        email: newUser.email,
        displayName: newUser.displayName || null,
        role: 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      if (newUser.plan) {
        await setDoc(doc(db, 'users', userId, 'subscriptions', newUser.plan), {
          active: true,
          status: 'active',
          method: 'admin',
          createdAt: serverTimestamp(),
          startDate: serverTimestamp()
        });
      }

      alert(`✅ Usuário ${newUser.email} criado com sucesso!`);
      setNewUser({ email: '', password: '', displayName: '', plan: 'basic' });
      setShowAddUserModal(false);
      await loadAdminData();
      
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      let errorMessage = 'Erro ao criar usuário.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso!';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres!';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido!';
      }
      
      alert('❌ ' + errorMessage);
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`⚠️ Tem certeza que deseja excluir o usuário ${userEmail}?\n\nIsso irá remover:\n- Conta do usuário\n- Todas as assinaturas\n- Todo o progresso\n\nEsta ação NÃO pode ser desfeita!`)) {
      return;
    }

    try {
      setLoading(true);

      const subsSnapshot = await getDocs(collection(db, 'users', userId, 'subscriptions'));
      for (const subDoc of subsSnapshot.docs) {
        await deleteDoc(doc(db, 'users', userId, 'subscriptions', subDoc.id));
      }

      const progressSnapshot = await getDocs(collection(db, 'users', userId, 'progress'));
      for (const progDoc of progressSnapshot.docs) {
        await deleteDoc(doc(db, 'users', userId, 'progress', progDoc.id));
      }

      await deleteDoc(doc(db, 'users', userId));

      alert(`✅ Usuário ${userEmail} excluído com sucesso!`);
      await loadAdminData();
      
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('❌ Erro ao excluir usuário: ' + error.message);
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateRevenue = () => {
    const prices = { basic: 29.90, pro: 49.90, elite: 99.90 };
    let total = 0;
    Object.keys(stats.planStats).forEach(plan => {
      total += stats.planStats[plan].active * prices[plan];
    });
    return total.toFixed(2);
  };

  if (!isAdmin) {
    return (
      <div className="go-academy-admin-page">
        <h1>Acesso Negado</h1>
      </div>
    );
  }

  return (
    <div className="go-academy-admin-page">
      <Header />
      
      <div className="admin-container">
        <div className="admin-header">
          <h1>👑 Painel de Administração</h1>
          <p>Bem-vindo, {currentUser?.email}</p>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{stats.totalUsers}</div>
                <div className="stat-label">Total</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{stats.activeUsers}</div>
                <div className="stat-label">Ativos</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">❌</div>
                <div className="stat-value">{stats.usersWithoutPlan}</div>
                <div className="stat-label">Sem Plano</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">✔️</div>
                <div className="stat-value">{stats.totalModulesCompleted}</div>
                <div className="stat-label">Módulos</div>
              </div>
            </div>

            <div className="plans-section">
              <h2>📊 Planos</h2>
              <div className="plans-grid">
                <div className="plan-card basic">
                  <div className="plan-header">
                    <h3>🥉 BASIC</h3>
                    <span className="plan-price">R$ 29,90</span>
                  </div>
                  <div className="plan-stats">
                    <div className="plan-stat">
                      <span className="stat-number active">{stats.planStats.basic.active}</span>
                      <span className="stat-text">Ativos</span>
                    </div>
                    <div className="plan-stat">
                      <span className="stat-number inactive">{stats.planStats.basic.inactive}</span>
                      <span className="stat-text">Inativos</span>
                    </div>
                  </div>
                  <div className="plan-revenue">
                    R$ {(stats.planStats.basic.active * 29.90).toFixed(2)}
                  </div>
                </div>

                <div className="plan-card pro">
                  <div className="plan-header">
                    <h3>🥈 PRO</h3>
                    <span className="plan-price">R$ 49,90</span>
                  </div>
                  <div className="plan-stats">
                    <div className="plan-stat">
                      <span className="stat-number active">{stats.planStats.pro.active}</span>
                      <span className="stat-text">Ativos</span>
                    </div>
                    <div className="plan-stat">
                      <span className="stat-number inactive">{stats.planStats.pro.inactive}</span>
                      <span className="stat-text">Inativos</span>
                    </div>
                  </div>
                  <div className="plan-revenue">
                    R$ {(stats.planStats.pro.active * 49.90).toFixed(2)}
                  </div>
                </div>

                <div className="plan-card elite">
                  <div className="plan-header">
                    <h3>🥇 ELITE</h3>
                    <span className="plan-price">R$ 99,90</span>
                  </div>
                  <div className="plan-stats">
                    <div className="plan-stat">
                      <span className="stat-number active">{stats.planStats.elite.active}</span>
                      <span className="stat-text">Ativos</span>
                    </div>
                    <div className="plan-stat">
                      <span className="stat-number inactive">{stats.planStats.elite.inactive}</span>
                      <span className="stat-text">Inativos</span>
                    </div>
                  </div>
                  <div className="plan-revenue">
                    R$ {(stats.planStats.elite.active * 99.90).toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="total-revenue">
                <h3>💰 Receita Total</h3>
                <div className="revenue-value">R$ {calculateRevenue()}</div>
              </div>
            </div>

            <div className="users-section">
              <div className="users-header">
                <h2>👥 Usuários Cadastrados</h2>
                <button className="add-user-btn" onClick={() => setShowAddUserModal(true)}>
                  ➕ Adicionar Usuário
                </button>
              </div>
              
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Nome</th>
                      <th>Role</th>
                      <th>Plano</th>
                      <th>Progresso</th>
                      <th>Módulos</th>
                      <th>Login</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>{user.displayName || '-'}</td>
                        <td>
                          {user.role === 'admin' ? (
                            <span className="role-badge admin">👑 Admin</span>
                          ) : (
                            <span className="role-badge user">👤 User</span>
                          )}
                        </td>
                        <td>
                          {user.subscriptions.length > 0 ? (
                            <div className="subscriptions-list">
                              {user.subscriptions.map(sub => (
                                <span 
                                  key={sub.id} 
                                  className={`sub-badge ${sub.active ? 'active' : 'inactive'}`}
                                >
                                  {sub.id.toUpperCase()}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="no-plan">Sem plano</span>
                          )}
                        </td>
                        <td>{user.progressCount || '-'}</td>
                        <td>{user.modulesCompleted || '-'}</td>
                        <td>{formatDate(user.lastLogin)}</td>
                        <td>
                          {user.role !== 'admin' && (
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteUser(user.id, user.email)}
                              title="Excluir usuário"
                            >
                              🗑️
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="admin-actions">
              <h2>⚙️ Ações</h2>
              <div className="actions-grid">
                <button className="action-btn" onClick={loadAdminData}>
                  🔄 Atualizar
                </button>
                <button className="action-btn" onClick={() => window.open('https://console.firebase.google.com/project/platcursomaicon/firestore', '_blank')}>
                  🔥 Firebase
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showAddUserModal && (
        <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Adicionar Novo Usuário</h2>
              <button className="modal-close" onClick={() => setShowAddUserModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleAddUser} className="add-user-form">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="usuario@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Senha *</label>
                <input
                  type="password"
                  id="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  minLength="6"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="displayName">Nome Completo</label>
                <input
                  type="text"
                  id="displayName"
                  value={newUser.displayName}
                  onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                  placeholder="Nome do usuário (opcional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="plan">Plano de Assinatura</label>
                <select
                  id="plan"
                  value={newUser.plan}
                  onChange={(e) => setNewUser({ ...newUser, plan: e.target.value })}
                >
                  <option value="">Sem plano</option>
                  <option value="basic">Basic - R$ 29,90</option>
                  <option value="pro">Pro - R$ 49,90</option>
                  <option value="elite">Elite - R$ 99,90</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddUserModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  ✅ Criar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
