const moedasService = require('../services/moedasService');

exports.getAll = async (req, res) => {
  const moedas = await moedasService.getAll();
  res.json(moedas);
};
