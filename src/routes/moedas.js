const express = require('express');
const router = express.Router();
const moedasController = require('../controllers/moedasController');

router.get('/', moedasController.getAll);

module.exports = router;
