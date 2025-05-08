const express = require('express');
const router = express.Router();
const propostasController = require('../controllers/propostasController');
const { create, update } = require('../validators/propostasValidator');
const auth = require('../middleware/auth');

// CRUD
router.get('/', auth, propostasController.getAll);
router.get('/filter', auth, propostasController.filter);
router.get('/:id', auth, propostasController.getById);
router.post('/', auth, create, propostasController.create);
router.put('/:id', auth, update, propostasController.update);
router.delete('/:id', auth, propostasController.remove);

// Extra endpoints para dados complementares da proposta
router.post('/diasuteis', propostasController.saveDiasUteis);
router.post('/valores', propostasController.saveValores);
router.post('/tipointervencao', propostasController.saveTipoIntervencao);

module.exports = router;
