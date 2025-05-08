const pool = require('../db/connection');
const service = require('../services/processosService');
const { validationResult } = require('express-validator');

// Helper para validação
function validarProcesso(data) {
  const obrigatorios = ['PROPOSTA', 'DATAPROP', 'VALOR', 'NOM_CLI', 'ESTADO'];
  for (const campo of obrigatorios) {
    if (!data[campo]) {
      return `Campo obrigatório ausente: ${campo}`;
    }
  }
  if (isNaN(Number(data.VALOR)) || Number(data.VALOR) < 0) {
    return 'VALOR deve ser um número positivo';
  }
  // Validação simples de datas (pode ser expandida)
  if (data.DATAPROP && isNaN(Date.parse(data.DATAPROP))) {
    return 'DATAPROP inválida';
  }
  return null;
}

// Buscar todos os processos
exports.getAll = async (req, res, next) => {
  try {
    const rows = await service.getAll();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Buscar processo por ID
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

// Buscar processos com filtros flexíveis
exports.filter = async (req, res, next) => {
  try {
    const rows = await service.filter(req.query);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Criar novo processo
exports.create = async (req, res, next) => {
  try {
    console.log('Recebido no POST /api/processos:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), body: req.body });
    }
    const data = req.body;
    const erro = validarProcesso(data);
    if (erro) return res.status(400).json({ error: erro, body: req.body });
    const created = await service.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

// Atualizar processo
exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const data = req.body;
    const erro = validarProcesso(data);
    if (erro) return res.status(400).json({ error: erro });
    const updated = await service.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Registro não encontrado' });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// Deletar processo
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await service.remove(id);
    res.json({ message: 'Registro removido com sucesso' });
  } catch (error) {
    next(error);
  }
};
