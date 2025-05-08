require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models');
const routes = require('./src/routes');

const app = express();

// CORS configuration - configuração mais permissiva para desenvolvimento
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware para parsear JSON e URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rota de teste direta
app.get('/', (req, res) => {
  res.send('Servidor do módulo Comercial está funcionando!');
});

// Teste da rota para verificar se a API está funcionando
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', message: 'API funcionando corretamente' });
});

// API routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Erro interno do servidor',
      status: err.status || 500
    }
  });
});

let PORT = process.env.PORT || 3001;

// Sincronizar modelos com o banco de dados
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Modelos sincronizados com sucesso');
    
    // Iniciar o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao sincronizar modelos:', error);
  });
const MAX_PORT = 3010; // Limite máximo de tentativas

async function startServer() {
  try {
    // Testar a conexão com o banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Sincronizar os modelos com o banco de dados sem alterar estrutura
    await sequelize.sync({ alter: false, force: false });
    console.log('Database synchronized successfully');
    
    // Função para tentar iniciar o servidor em uma porta
    const tryStartServer = (port) => {
      return new Promise((resolve, reject) => {
        const server = app.listen(port, '0.0.0.0', () => {
          console.log(`Server is running on port ${port}`);
          console.log(`API available at http://localhost:${port}/api`);
          resolve(server);
        });

        server.on('error', (error) => {
          if (error.code === 'EADDRINUSE') {
            reject(error);
          } else {
            console.error('Erro ao iniciar o servidor:', error);
            process.exit(1);
          }
        });
      });
    };

    // Tentar portas alternativas
    let server;
    while (PORT <= MAX_PORT) {
      try {
        server = await tryStartServer(PORT);
        break;
      } catch (error) {
        if (error.code === 'EADDRINUSE') {
          console.log(`Porta ${PORT} em uso, tentando próxima porta...`);
          PORT++;
        } else {
          throw error;
        }
      }
    }

    if (!server) {
      throw new Error(`Não foi possível encontrar uma porta disponível entre ${process.env.PORT || 3001} e ${MAX_PORT}`);
    }
    
    // Tratamento para sinais de término do processo
    process.on('SIGINT', () => {
      console.log('Encerrando servidor...');
      server.close(() => {
        console.log('Servidor encerrado.');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  }
}

startServer();
