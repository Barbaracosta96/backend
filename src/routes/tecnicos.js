const express = require('express');
const express = require('express');
const router = express.Router();
const tecnicosController = require('../controllers/tecnicosController');
const { validateTecnico } = require('../middleware/validations');

// Rota para buscar todos os técnicos
router.get('/', tecnicosController.getAll);

// Rota para buscar um técnico específico por ID
router.get('/:id', tecnicosController.getById);

// Rota para criar um novo técnico
router.post('/', validateTecnico, tecnicosController.create);

// Rota para atualizar um técnico
router.put('/:id', validateTecnico, tecnicosController.update);

// Rota para desativar um técnico
router.delete('/:id', tecnicosController.delete);

module.exports = router;
