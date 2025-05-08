require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;
const pool = require('./db/connection');
const errorHandler = require('./middleware/errorHandler');

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cors({ 
  origin: process.env.CORS_ORIGIN || '*', // Permitir todas as origens em desenvolvimento
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Configuração de CORS mais permissiva

// Rota específica para favicon
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// Importar rotas
const processosRoutes = require('./routes/processos');
const propostasRoutes = require('./routes/propostas');
const trabalhoRealizadoRoutes = require('./routes/trabalhoRealizado');
const consultaEAlteracaoRoutes = require('./routes/consultaEAlteracao'); // Já importado
const fechamentoRoutes = require('./routes/fechamento');
const processosAbertosRoutes = require('./routes/processosAbertos');
const clientesRoutes = require('./routes/clientes');
const moedasRoutes = require('./routes/moedas');
const tiposIntervencaoRoutes = require('./routes/tiposIntervencao');
const tecnicosRoutes = require('./routes/tecnicos');

// Usar rotas - Removendo duplicatas e garantindo que a correta seja usada.
app.use('/api/processos', processosRoutes);
app.use('/api/propostas', propostasRoutes);
app.use('/api/trabalho-realizado', trabalhoRealizadoRoutes);
app.use('/api/consulta-e-alteracao', consultaEAlteracaoRoutes); // Corrigido aqui
app.use('/api/fechamento', fechamentoRoutes);
app.use('/api/processos-abertos', processosAbertosRoutes);
// A rota '/api/processos' já foi definida acima. Se for diferente, use um path diferente.

app.use('/api/clientes', clientesRoutes);
app.use('/api/moedas', moedasRoutes);
app.use('/api/tipos-intervencao', tiposIntervencaoRoutes);
app.use('/api/tecnicos', tecnicosRoutes);


app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS result');
    res.json({
      status: 'ok',
      db: true,
      env: {
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME,
        DB_PORT: process.env.DB_PORT,
        NODE_ENV: process.env.NODE_ENV,
        TABELA: process.env.TABELA,
      },
      dbResult: rows[0]
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', db: false, error: error.message });
  }
});

// Healthcheck para frontend (redundante com o de cima se for o mesmo propósito)
// Se este for específico para frontend sem info de env, pode manter.
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS result');
    res.json({
      status: 'ok',
      db: true,
      dbResult: rows[0]
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', db: false, error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Backend Comercial rodando!');
});

app.use(errorHandler);

module.exports = app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}