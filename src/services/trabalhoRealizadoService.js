const pool = require('../db/connection');

module.exports = {
  async getAll() { const [rows] = await pool.query('SELECT * FROM abrobra'); return rows; },
  async getById(id) { const [rows] = await pool.query('SELECT * FROM abrobra WHERE id = ?', [id]); return rows[0]; },
  async filter(query) { return []; },
  async create(data) { const [result] = await pool.query('INSERT INTO abrobra SET ?', [data]); return { id: result.insertId, ...data }; },
  async update(id, data) { await pool.query('UPDATE abrobra SET ? WHERE id = ?', [data, id]); return { id, ...data }; },
  async remove(id) { await pool.query('DELETE FROM abrobra WHERE id = ?', [id]); return { id }; }
};
