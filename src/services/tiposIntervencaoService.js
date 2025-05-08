const db = require('../db/connection');

exports.getAll = async () => {
  const [rows] = await db.query('SELECT * FROM tipos_intervencao');
  return rows;
};
