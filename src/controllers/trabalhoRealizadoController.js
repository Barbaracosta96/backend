const service = require('../services/trabalhoRealizadoService');
const { validationResult } = require('express-validator');

// ... (função validarTrabalho) ...

exports.getAll = async (req, res, next) => {
  try {
    // Passar req.query para o service para filtrar
    // O frontend envia 'numeroProcesso', o service pode esperar 'PROPOSTA' ou 'numeroProcesso'
    const filters = {};
    if (req.query.numeroProcesso) {
      filters.proposta = req.query.numeroProcesso; // Mapeia para o nome que o service espera
    }
    // Adicione outros filtros de req.query se necessário

    const rows = await service.getAll(filters); // Modificar service para aceitar filtros
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const row = await service.getById(req.params.id);
    if (!row) return res.status(404).json({ error: 'Não encontrado' });
    res.json(row);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const result = await service.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const result = await service.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};