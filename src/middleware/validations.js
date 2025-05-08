const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Erro de validação', 
      errors: errors.array() 
    });
  }
  next();
};

exports.validateTipoIntervencao = [
  body('nome')
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 3, max: 100 }).withMessage('Nome deve ter entre 3 e 100 caracteres'),
  
  body('descricao')
    .optional()
    .isLength({ max: 255 }).withMessage('Descrição não pode exceder 255 caracteres'),
  
  body('ativo')
    .optional()
    .isBoolean().withMessage('Ativo deve ser um valor booleano'),
  
  handleValidationErrors
];

exports.validateTecnico = [
  body('nome')
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 3, max: 100 }).withMessage('Nome deve ter entre 3 e 100 caracteres'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Email inválido'),
  
  body('telefone')
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Telefone inválido'),
  
  body('ativo')
    .optional()
    .isBoolean().withMessage('Ativo deve ser um valor booleano'),
  
  handleValidationErrors
];

exports.validateTecnico = [
  body('nome')
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 3, max: 100 }).withMessage('Nome deve ter entre 3 e 100 caracteres'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Email inválido'),
  
  body('telefone')
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Telefone inválido'),
  
  body('ativo')
    .optional()
    .isBoolean().withMessage('Ativo deve ser um valor booleano'),
  
  handleValidationErrors
];
