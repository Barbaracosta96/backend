const tecnicosService = require('../services/tecnicosService');

exports.getAll = async (req, res) => {
  const tecnicos = await tecnicosService.getAll();
  res.json(tecnicos);
};
