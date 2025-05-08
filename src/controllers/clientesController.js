const clientesService = require('../services/clientesService');

exports.getAll = async (req, res) => {
  const clientes = await clientesService.getAll();
  res.json(clientes);
};

exports.create = async (req, res) => {
  const cliente = await clientesService.create(req.body);
  res.status(201).json(cliente);
};
