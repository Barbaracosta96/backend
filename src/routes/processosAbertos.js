const express = require('express');
const router = express.Router();
const processosAbertosController = require('../controllers/processosAbertosController');
const { create, update } = require('../validators/processosAbertosValidator');
const auth = require('../middleware/auth');

router.get('/', auth, processosAbertosController.getAll);
router.get('/filter', auth, processosAbertosController.filter);
router.get('/:id', auth, processosAbertosController.getById);
router.post('/', auth, create, processosAbertosController.create);
router.put('/:id', auth, update, processosAbertosController.update);
router.delete('/:id', auth, processosAbertosController.remove);

module.exports = router;
