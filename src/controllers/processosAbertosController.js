const pool = require('../db/connection');
const service = require('../services/processosAbertosService');
const { validationResult } = require('express-validator');

// Helper para validação
function validarProcessoAberto(data) {
  const obrigatorios = ['PROPOSTA', 'DATAPROP', 'NOM_CLI', 'ESTADO'];
  for (const campo of obrigatorios) {
    if (!data[campo]) {
      return `Campo obrigatório ausente: ${campo}`;
    }
  }
  if (data.DATAPROP && isNaN(Date.parse(data.DATAPROP))) {
    return 'DATAPROP inválida';
  }
  return null;
}

exports.getAll = async (req, res, next) => {
  try {
    const rows = await service.getAll();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const row = await service.getById(id);
    if (!row) return res.status(404).json({ error: 'Registro não encontrado' });
    res.json(row);
  } catch (error) {
    next(error);
  }
};

exports.filter = async (req, res, next) => {
  try {
    const rows = await service.filter(req.query);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const data = req.body;
    const erro = validarProcessoAberto(data);
    if (erro) return res.status(400).json({ error: erro });
    // Força o estado para ABERTO
    data.ESTADO = 'ABERTO';
    const created = await service.create(data);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const data = req.body;
    const erro = validarProcessoAberto(data);
    if (erro) return res.status(400).json({ error: erro });
    // Força o estado para ABERTO
    data.ESTADO = 'ABERTO';
    const updated = await service.update(id, data);
    if (!updated) return res.status(404).json({ error: 'Registro não encontrado' });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await service.remove(id);
    res.json({ message: 'Registro removido com sucesso' });
  } catch (error) {
    next(error);
  }
};
