const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

// Importar configurações do arquivo .env
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Usar as variáveis de ambiente do arquivo .env
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bancomysql',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT) || 3306
};

console.log('Configurações do banco de dados:');
console.log(`Host: ${DB_CONFIG.host}`);
console.log(`Porta: ${DB_CONFIG.port}`);
console.log(`Database: ${DB_CONFIG.database}`);
console.log(`Usuário: ${DB_CONFIG.username}`);
console.log(`Tabela: ${process.env.TABELA || 'abrobra'}`);

// Configuração da conexão com o banco de dados
const sequelize = new Sequelize(
  DB_CONFIG.database,
  DB_CONFIG.username,
  DB_CONFIG.password,
  {
    host: DB_CONFIG.host,
    dialect: 'mysql',
    port: DB_CONFIG.port,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      connectTimeout: 60000,
      // Adicionar opções SSL se necessário para conexão remota segura
      ...(process.env.DB_SSL === 'true' && {
        ssl: {
          require: true,
          rejectUnauthorized: false // apenas em desenvolvimento
        }
      })
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    retry: {
      max: 3
    }
  }
);

// Objeto para armazenar os modelos
const db = {};

// Tentar carregar modelos apenas se explicitamente especificados
try {
  // Importar os modelos dinamicamente
  fs.readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      try {
        const model = require(path.join(__dirname, file))(sequelize);
        db[model.name] = model;
        console.log(`Modelo carregado: ${model.name}`);
      } catch (err) {
        console.error(`Erro ao carregar modelo ${file}:`, err);
      }
    });

  // Importar manualmente o modelo Abrobra
  db.Abrobra = require('./Abrobra')(sequelize);
  console.log('Modelo Abrobra carregado com sucesso');

  // Configurar as associações
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
} catch (error) {
  console.error('Erro ao carregar modelos:', error);
}

// Testar a conexão em caso de erro para ajudar a diagnosticar
sequelize.authenticate()
  .then(() => console.log('Conexão com o banco testada com sucesso'))
  .catch(err => console.error('Erro ao testar conexão com o banco:', err));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; 