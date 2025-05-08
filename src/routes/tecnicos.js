const express = require('express');
const router = express.Router();
const tecnicosController = require('../controllers/tecnicosController');

router.get('/', tecnicosController.getAll);

module.exports = router;
