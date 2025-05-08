const pool = require('../db/connection');
const service = require('../services/propostasService');
const { validationResult } = require('express-validator');

// Helper para validação
function validarProposta(data) {
  const obrigatorios = ['PROPOSTA', 'DATAPROP', 'VALORPROP', 'NOM_CLI', 'ESTADO'];
  for (const campo of obrigatorios) {
    if (!data[campo]) {
      return `Campo obrigatório ausente: ${campo}`;
    }
  }
  if (isNaN(Number(data.VALORPROP)) || Number(data.VALORPROP) < 0) {
    return 'VALORPROP deve ser um número positivo';
  }
  if (data.DATAPROP && isNaN(Date.parse(data.DATAPROP))) {
    return 'DATAPROP inválida';
  }
  return null;
}

// Buscar todas as propostas
exports.getAll = async (req, res, next) => {
  try {
    const rows = await service.getAll();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Buscar proposta por ID
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

// Buscar propostas com filtros flexíveis
exports.filter = async (req, res, next) => {
  try {
    const rows = await service.filter(req.query);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Criar nova proposta
exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const data = req.body;
    const erro = validarProposta(data);
    if (erro) return res.status(400).json({ error: erro });
    const created = await service.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

// Atualizar proposta
exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const data = req.body;
    const erro = validarProposta(data);
    if (erro) return res.status(400).json({ error: erro });
    const updated = await service.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Registro não encontrado' });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// Deletar proposta
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await service.remove(id);
    res.json({ message: 'Registro removido com sucesso' });
  } catch (error) {
    next(error);
  }
};

// Salvar dias úteis da proposta
exports.saveDiasUteis = async (req, res, next) => {
  try {
    const { propostaId, diasInicio, tipoInicio, diasExecucao, tipoExecucao, diasConclusao, tipoConclusao } = req.body;
    const result = await service.saveDiasUteis({ propostaId, diasInicio, tipoInicio, diasExecucao, tipoExecucao, diasConclusao, tipoConclusao });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Salvar valores da proposta
exports.saveValores = async (req, res, next) => {
  try {
    const { propostaId, valor, moeda } = req.body;
    const result = await service.saveValores({ propostaId, valor, moeda });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Salvar tipos de intervenção da proposta
exports.saveTipoIntervencao = async (req, res, next) => {
  try {
    const { propostaId, tiposSelecionados } = req.body;
    const result = await service.saveTipoIntervencao({ propostaId, tiposSelecionados });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
