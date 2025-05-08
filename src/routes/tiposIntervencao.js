const express = require('express');
const router = express.Router();
const tiposIntervencaoController = require('../controllers/tiposIntervencaoController');

router.get('/', tiposIntervencaoController.getAll);

module.exports = router;
