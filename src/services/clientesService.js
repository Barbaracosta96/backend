const db = require('../db/connection');

exports.getAll = async () => {
  // ajuste para seu banco real
  const [rows] = await db.query('SELECT * FROM clientes');
  return rows;
};

exports.create = async (data) => {
  const { nome } = data;
  const [result] = await db.query('INSERT INTO clientes (nome) VALUES (?)', [nome]);
  return { id: result.insertId, nome };
};
