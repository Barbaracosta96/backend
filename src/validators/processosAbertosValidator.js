const { body } = require('express-validator');

exports.create = [
  body('NUM_OBR').notEmpty().isLength({max:5}),
  body('NOM_CLI').notEmpty().isLength({max:100}),
  body('DES_OBR').notEmpty().isLength({max:100}),
  body('LOC_OBR').notEmpty().isLength({max:100}),
  body('MORADAOB').optional().isLength({max:100}),
  body('PAIS').isInt(),
  body('DAT_INIC').isISO8601(),
  body('DAT_FIM').optional().isISO8601(),
  body('ESTADO').isLength({max:1}),
  body('BLOQUEADO').isBoolean(),
  body('LOTE').isInt(),
  body('OBS').optional(),
  body('FACTURA').optional().isLength({max:20}),
  body('VALOR').isDecimal(),
  body('TECNICO').notEmpty().isLength({max:40}),
  // Adicione outros campos conforme necessário
];

exports.update = [
  body('NUM_OBR').optional().isLength({max:5}),
  body('NOM_CLI').optional().isLength({max:100}),
  body('DES_OBR').optional().isLength({max:100}),
  body('LOC_OBR').optional().isLength({max:100}),
  body('MORADAOB').optional().isLength({max:100}),
  body('PAIS').optional().isInt(),
  body('DAT_INIC').optional().isISO8601(),
  body('DAT_FIM').optional().isISO8601(),
  body('ESTADO').optional().isLength({max:1}),
  body('BLOQUEADO').optional().isBoolean(),
  body('LOTE').optional().isInt(),
  body('OBS').optional(),
  body('FACTURA').optional().isLength({max:20}),
  body('VALOR').optional().isDecimal(),
  body('TECNICO').optional().isLength({max:40}),
  // Adicione outros campos conforme necessário
];
