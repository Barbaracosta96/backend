const tiposIntervencaoService = require('../services/tiposIntervencaoService');
const logger = require('../utils/logger');

exports.getAll = async (req, res) => {
  try {
    const tipos = await tiposIntervencaoService.getAll();
    res.json(tipos);
  } catch (error) {
    logger.error('Erro no controller ao buscar tipos de intervenção', { error });
    res.status(500).json({
      message: 'Erro ao buscar tipos de intervenção',
      error: error.message
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const tipo = await tiposIntervencaoService.getById(id);
    
    if (!tipo) {
      return res.status(404).json({ message: 'Tipo de intervenção não encontrado' });
    }
    
    res.json(tipo);
  } catch (error) {
    logger.error('Erro no controller ao buscar tipo de intervenção por ID', { error, id: req.params.id });
    res.status(500).json({
      message: 'Erro ao buscar tipo de intervenção',
      error: error.message
    });
  }
};

exports.create = async (req, res) => {
  try {
    const novoTipo = req.body;
    const id = await tiposIntervencaoService.create(novoTipo);
    res.status(201).json({ id, message: 'Tipo de intervenção criado com sucesso' });
  } catch (error) {
    logger.error('Erro no controller ao criar tipo de intervenção', { error, dados: req.body });
    res.status(400).json({
      message: 'Erro ao criar tipo de intervenção',
      error: error.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizacao = req.body;
    
    await tiposIntervencaoService.update(id, dadosAtualizacao);
    res.json({ message: 'Tipo de intervenção atualizado com sucesso' });
  } catch (error) {
    logger.error('Erro no controller ao atualizar tipo de intervenção', { error, id: req.params.id, dados: req.body });
    res.status(400).json({
      message: 'Erro ao atualizar tipo de intervenção',
      error: error.message
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    await tiposIntervencaoService.delete(id);
    res.json({ message: 'Tipo de intervenção desativado com sucesso' });
  } catch (error) {
    logger.error('Erro no controller ao desativar tipo de intervenção', { error, id: req.params.id });
    res.status(500).json({
      message: 'Erro ao desativar tipo de intervenção',
      error: error.message
    });
  }
};
