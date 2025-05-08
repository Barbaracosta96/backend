const service = require('../services/processosService');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

exports.create = async (req, res, next) => {
  try {
    logger.info('ProcessosController: Recebida requisição para criar processo:', req.body);
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
      logger.warn('ProcessosController: Erro de validação ao criar processo:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    
    const processoData = req.body; 
    const createdProcesso = await service.create(processoData);
    logger.info('ProcessosController: Processo criado com sucesso:', createdProcesso);
    res.status(201).json(createdProcesso);
  } catch (error) {
    logger.error('ProcessosController: Erro ao criar processo:', error);
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`ProcessosController: Buscando processo com ID: ${id}`);
    const processo = await service.getById(id);
    if (!processo) {
      logger.warn(`ProcessosController: Processo com ID ${id} não encontrado.`);
      return res.status(404).json({ error: 'Processo não encontrado' });
    }
    logger.info(`ProcessosController: Processo encontrado:`, processo);
    res.json(processo);
  } catch (error) {
    logger.error(`ProcessosController: Erro ao buscar processo por ID ${req.params.id}:`, error);
    next(error);
  }
};
