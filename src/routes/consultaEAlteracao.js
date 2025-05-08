const express = require('express');
const router = express.Router();
const consultaEAlteracaoController = require('../controllers/consultaEAlteracaoController');
// Importando o validador renomeado
const { createOrUpdate } = require('../validators/consultaEAlteracaoValidator');
const auth = require('../middleware/auth'); // Supondo que seu middleware de auth funciona

// GET /api/consulta-e-alteracao - Busca todos com filtros opcionais
router.get('/', auth, consultaEAlteracaoController.getAll);

// GET /api/consulta-e-alteracao/:id - Busca por ID
router.get('/:id', auth, consultaEAlteracaoController.getById);

// POST /api/consulta-e-alteracao - Cria um novo registro
router.post('/', auth, createOrUpdate, consultaEAlteracaoController.create);

// PUT /api/consulta-e-alteracao/:id - Atualiza um registro existente
router.put('/:id', auth, createOrUpdate, consultaEAlteracaoController.update);

// DELETE /api/consulta-e-alteracao/:id - Remove um registro
router.delete('/:id', auth, consultaEAlteracaoController.remove);

// A rota /filter não é mais estritamente necessária se getAll lida com query params
// Mas se você quiser mantê-la por algum motivo específico:
// router.get('/filter', auth, consultaEAlteracaoController.getAll); // ou aponte para uma função filter específica

module.exports = router;