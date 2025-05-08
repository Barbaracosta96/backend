const express = require('express');
const router = express.Router();
const fechamentoController = require('../controllers/fechamentoController');
// const { create, update } = require('../validators/fechamentoValidator'); // Pode não ser necessário para "fechar"
const { param } = require('express-validator'); // Para validar o parâmetro da rota
const auth = require('../middleware/auth');

// Rota original, manter se ainda for usada para CRUD completo de 'fechamentos'
// router.post('/', auth, create, fechamentoController.create);
// ... outras rotas CRUD ...

// Nova rota para a ação de fechar um processo por seu número/identificador
router.put(
  '/:numeroProcesso/close', // Ex: /api/fechamento/PROCESSO123/close
  auth,
  [
    param('numeroProcesso').notEmpty().withMessage('Número do processo é obrigatório.').trim().escape(),
  ],
  fechamentoController.closeProcessByNumber // Nova função no controller
);

// Se você quiser manter o POST /api/fechamento para essa ação:
// router.post('/close', auth, [body('numeroProcesso').notEmpty()], fechamentoController.closeProcessByNumberFromPOST);


// Manter as rotas de consulta se necessárias
router.get('/', auth, fechamentoController.getAll);
router.get('/filter', auth, fechamentoController.filter); // Se existir
router.get('/:id', auth, fechamentoController.getById);   // Se for ID numérico

module.exports = router;