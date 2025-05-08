const service = require('../services/consultaEAlteracaoService');
const { validationResult } = require('express-validator');

// Não precisamos mais do validarConsultaAlteracao, o express-validator faz isso.

exports.getAll = async (req, res, next) => {
  try {
    // Passar req.query para o service para que ele possa usar os filtros
    const rows = await service.getAll(req.query);
    res.json(rows);
  } catch (error) {
    console.error("Erro em getAll:", error);
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
    console.error("Erro em getById:", error);
    next(error);
  }
};

// A função filter pode ser removida se getAll agora lida com filtros via req.query
// Se você quiser manter uma rota /filter separada, pode, mas getAll agora é mais flexível.
// exports.filter = async (req, res, next) => { ... }

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Os dados já incluem os campos do formData e os radioOptions (se enviados no corpo)
    const created = await service.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    console.error("Erro em create:", error);
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
    const updated = await service.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Registro não encontrado para atualizar' });
    res.json(updated);
  } catch (error) {
    console.error("Erro em update:", error);
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removed = await service.remove(id);
    if (!removed) return res.status(404).json({ error: 'Registro não encontrado para remover' });
    res.json({ message: 'Registro removido com sucesso', id });
  } catch (error) {
    console.error("Erro em remove:", error);
    next(error);
  }
};