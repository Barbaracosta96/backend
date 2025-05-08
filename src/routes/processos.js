const express = require('express');
const router = express.Router();
const processosController = require('../controllers/processosController');
const { create, update } = require('../validators/processosValidator');
const auth = require('../middleware/auth');

// CRUD
router.get('/', auth, processosController.getAll);
router.get('/filter', auth, processosController.filter);
router.get('/:id', auth, processosController.getById);
router.post('/', auth, create, processosController.create);
router.put('/:id', auth, update, processosController.update);
router.delete('/:id', auth, processosController.remove);

module.exports = router;
