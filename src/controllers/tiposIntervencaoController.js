const tiposIntervencaoService = require('../services/tiposIntervencaoService');

exports.getAll = async (req, res) => {
  const tipos = await tiposIntervencaoService.getAll();
  res.json(tipos);
};
