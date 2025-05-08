const express = require('express');
const router = express.Router();
const tiposIntervencaoController = require('../controllers/tiposIntervencaoController');
const { validateTipoIntervencao } = require('../middleware/validations');

// Rota para buscar todos os tipos de intervenção
router.get('/', tiposIntervencaoController.getAll);

// Rota para buscar um tipo de intervenção específico por ID
router.get('/:id', tiposIntervencaoController.getById);

// Rota para criar um novo tipo de intervenção
router.post('/', validateTipoIntervencao, tiposIntervencaoController.create);

// Rota para atualizar um tipo de intervenção
router.put('/:id', validateTipoIntervencao, tiposIntervencaoController.update);

// Rota para desativar um tipo de intervenção
router.delete('/:id', tiposIntervencaoController.delete);

module.exports = router;
