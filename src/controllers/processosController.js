const service = require('../services/processosService');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

exports.getAll = async (req, res, next) => {
  try {
    logger.info('ProcessosController: Recebida requisição para buscar todos os processos');
    const processos = await service.getAll(req.query);
    res.json(processos);
  } catch (error) {
    logger.error('ProcessosController: Erro ao buscar processos:', error);
    next(error);
  }
};

exports.filter = async (req, res, next) => {
  try {
    logger.info('ProcessosController: Recebida requisição para filtrar processos', req.query);
    const processosFiltrados = await service.filter(req.query);
    res.json(processosFiltrados);
  } catch (error) {
    logger.error('ProcessosController: Erro ao filtrar processos:', error);
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    logger.info('ProcessosController: Recebida requisição para atualizar processo', { id: req.params.id, dados: req.body });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('ProcessosController: Erro de validação ao atualizar processo:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    
    const updatedProcesso = await service.update(req.params.id, req.body);
    if (!updatedProcesso) {
      return res.status(404).json({ error: 'Processo não encontrado' });
    }
    
    logger.info('ProcessosController: Processo atualizado com sucesso:', updatedProcesso);
    res.json(updatedProcesso);
  } catch (error) {
    logger.error('ProcessosController: Erro ao atualizar processo:', error);
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    logger.info('ProcessosController: Recebida requisição para remover processo', { id: req.params.id });
    const removedProcesso = await service.remove(req.params.id);
    
    if (!removedProcesso) {
      return res.status(404).json({ error: 'Processo não encontrado' });
    }
    
    logger.info('ProcessosController: Processo removido com sucesso:', req.params.id);
    res.status(204).end();
  } catch (error) {
    logger.error('ProcessosController: Erro ao remover processo:', error);
    next(error);
  }
};

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
