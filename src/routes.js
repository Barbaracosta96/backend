const express = require('express');
const router = express.Router();

// Importar rotas específicas
const processosRoutes = require('./routes/processos');
const propostasRoutes = require('./routes/propostas');
const tiposIntervencaoRoutes = require('./routes/tiposIntervencao');
const tecnicosRoutes = require('./routes/tecnicos');

// Definir rotas
router.use('/processos', processosRoutes);
router.use('/propostas', propostasRoutes);
router.use('/tipos-intervencao', tiposIntervencaoRoutes);
router.use('/tecnicos', tecnicosRoutes);

module.exports = router;
