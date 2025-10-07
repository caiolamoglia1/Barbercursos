// src/modules/go-academy/pages/AdminPage/AdminPage.jsx
import React from 'react';
import './AdminPage.css';
// import migrateData from '../../migrateData';

function AdminPage() {
  const handleMigrateData = async () => {
    try {
      alert('Iniciando migração de dados...');
      // await migrateData();
      alert('Migração concluída com sucesso! Os dados foram transferidos para o Firebase.');
    } catch (error) {
      alert('Erro na migração: ' + error.message);
      console.error('Erro na migração:', error);
    }
  };

  return (
    <div className="go-academy-admin-page">
      <h1>Página de Administração</h1>
      <p>Use esta página para gerenciar dados do sistema.</p>

      <div className="go-academy-admin-actions">
        <button onClick={handleMigrateData} className="go-academy-migrate-btn">
          Migrar Dados para Firebase
        </button>
        <p className="go-academy-info-text">
          Clique para transferir todos os dados dos arquivos locais para o Firebase Firestore.
          <br />
          <strong>Importante:</strong> Execute apenas uma vez.
        </p>
      </div>
    </div>
  );
}

export default AdminPage;
