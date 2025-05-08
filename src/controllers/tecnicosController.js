const tecnicosService = require('../services/tecnicosService');
const tecnicosService = require('../services/tecnicosService');
const logger = require('../utils/logger');

exports.getAll = async (req, res) => {
  try {
    const tecnicos = await tecnicosService.getAll();
    res.json(tecnicos);
  } catch (error) {
    logger.error('Erro no controller ao buscar técnicos', { error });
    res.status(500).json({
      message: 'Erro ao buscar técnicos',
      error: error.message
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const tecnico = await tecnicosService.getById(id);
    
    if (!tecnico) {
      return res.status(404).json({ message: 'Técnico não encontrado' });
    }
    
    res.json(tecnico);
  } catch (error) {
    logger.error('Erro no controller ao buscar técnico por ID', { error, id: req.params.id });
    res.status(500).json({
      message: 'Erro ao buscar técnico',
      error: error.message
    });
  }
};

exports.create = async (req, res) => {
  try {
    const novoTecnico = req.body;
    const id = await tecnicosService.create(novoTecnico);
    res.status(201).json({ id, message: 'Técnico criado com sucesso' });
  } catch (error) {
    logger.error('Erro no controller ao criar técnico', { error, dados: req.body });
    res.status(400).json({
      message: 'Erro ao criar técnico',
      error: error.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizacao = req.body;
    
    await tecnicosService.update(id, dadosAtualizacao);
    res.json({ message: 'Técnico atualizado com sucesso' });
  } catch (error) {
    logger.error('Erro no controller ao atualizar técnico', { error, id: req.params.id, dados: req.body });
    res.status(400).json({
      message: 'Erro ao atualizar técnico',
      error: error.message
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    await tecnicosService.delete(id);
    res.json({ message: 'Técnico desativado com sucesso' });
  } catch (error) {
    logger.error('Erro no controller ao desativar técnico', { error, id: req.params.id });
    res.status(400).json({
      message: 'Erro ao desativar técnico',
      error: error.message
    });
  }
};
