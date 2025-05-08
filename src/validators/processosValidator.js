const { body } = require('express-validator');

// Validar os campos que vêm do frontend (payload do Abertura.js)
// Os nomes aqui devem corresponder às chaves no payload enviado pelo fetch.
exports.create = [
  body('proposta') // Anteriormente proposalNumber no frontend
    .notEmpty().withMessage('Número da proposta é obrigatório.')
    .isString().trim().escape(),
  body('versao')
    .notEmpty().withMessage('Versão é obrigatória.')
    .isInt({ min: 1 }).withMessage('Versão deve ser um número inteiro positivo.'),
  body('ano')
    .notEmpty().withMessage('Ano é obrigatório.')
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 }).withMessage('Ano inválido.'),
  body('nomeCliente') // Anteriormente client no frontend
    .notEmpty().withMessage('Cliente é obrigatório.')
    .isString().trim().escape(),
  body('dataAdjudicacao') // Anteriormente adjudicationDate
    .notEmpty().withMessage('Data de adjudicação é obrigatória.')
    .isISO8601().toDate().withMessage('Data de adjudicação inválida.'),
  body('valor')
    .notEmpty().withMessage('Valor é obrigatório.')
    .isFloat({ min: 0 }).withMessage('Valor deve ser um número não negativo.'),
  body('estado')
    .notEmpty().withMessage('Estado é obrigatório.')
    .isIn(['ABERTO', 'FECHADO', 'EM_ANDAMENTO']).withMessage('Estado inválido.'), // Ajuste os estados permitidos
];

// Para o update, pode ser similar, mas com .optional()
exports.update = [
  body('proposta').optional().isString().trim().escape(),
  // ... outros campos com .optional()
];