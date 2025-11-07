// Mock API server para testar localmente
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Mock da API create-checkout-session
app.post('/api/create-checkout-session', (req, res) => {
  const { planId, userId } = req.body;
  
  console.log('📦 Mock API recebeu:', { planId, userId });
  
  // Simula sucesso e redireciona para página de sucesso local
  res.json({
    sessionId: 'mock_session_123',
    url: `http://localhost:5173/success?session_id=mock_${planId}_${userId}&plan=${planId}`
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Mock API rodando em http://localhost:${PORT}`);
  console.log('✅ Teste a página de planos agora!');
});
