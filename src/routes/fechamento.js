const express = require('express');
const router = express.Router();
const fechamentoController = require('../controllers/fechamentoController');
const auth = require('../middleware/auth'); 
const { param, body } = require('express-validator'); 

router.post('/', auth, [
    body('propostaId').notEmpty().withMessage('ID da proposta é obrigatório'),
], fechamentoController.create);

router.put(
  '/:numeroProcesso/close',
  auth,
  [param('numeroProcesso').notEmpty().withMessage('Número do processo é obrigatório.').trim().escape()],
  fechamentoController.closeProcessByNumber
);
router.post(
    '/close-by-number', 
    auth,
    [body('numeroProcesso').notEmpty().withMessage('Número do processo é obrigatório.')],
    (req, res, next) => { 
        req.params = { numeroProcesso: req.body.numeroProcesso }; 
        fechamentoController.closeProcessByNumber(req, res, next);
    }
);


router.get('/', auth, fechamentoController.findAll);
router.get('/:id', auth, fechamentoController.findOne); 

module.exports = router;