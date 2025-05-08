const express = require('express');
const router = express.Router();
const trabalhoRealizadoController = require('../controllers/trabalhoRealizadoController');
const { create, update } = require('../validators/trabalhoRealizadoValidator'); // Para POST/PUT
const auth = require('../middleware/auth');

// GET para buscar trabalhos, pode usar query params para filtro
router.get('/', auth, trabalhoRealizadoController.getAll); // getAll agora lidará com filtros
// router.get('/filter', auth, trabalhoRealizadoController.filter); // Pode remover se getAll faz o filtro

router.get('/:id', auth, trabalhoRealizadoController.getById);
router.post('/', auth, create, trabalhoRealizadoController.create);
router.put('/:id', auth, update, trabalhoRealizadoController.update);
router.delete('/:id', auth, trabalhoRealizadoController.remove);

module.exports = router;