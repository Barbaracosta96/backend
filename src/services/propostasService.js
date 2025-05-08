const pool = require('../db/connection');

module.exports = {
  async getAll() { const [rows] = await pool.query('SELECT * FROM abrobra'); return rows; },
  async getById(id) { const [rows] = await pool.query('SELECT * FROM abrobra WHERE NUM_OBR = ?', [id]); return rows[0]; },
  async filter(query) { /* Adapte filtros conforme campos */ return []; },
  async create(data) { const [result] = await pool.query('INSERT INTO abrobra SET ?', [data]); return { NUM_OBR: data.NUM_OBR, ...data }; },
  async update(id, data) { await pool.query('UPDATE abrobra SET ? WHERE NUM_OBR = ?', [data, id]); return { NUM_OBR: id, ...data }; },
  async remove(id) { await pool.query('DELETE FROM abrobra WHERE NUM_OBR = ?', [id]); return { NUM_OBR: id }; },
  async saveDiasUteis({ propostaId, diasInicio, tipoInicio, diasExecucao, tipoExecucao, diasConclusao, tipoConclusao }) {
    const [result] = await pool.query(
      'INSERT INTO propostas_dias_uteis (proposta_id, dias_inicio, tipo_inicio, dias_execucao, tipo_execucao, dias_conclusao, tipo_conclusao) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [propostaId, diasInicio, tipoInicio, diasExecucao, tipoExecucao, diasConclusao, tipoConclusao]
    );
    return { id: result.insertId };
  },
  async saveValores({ propostaId, valor, moeda }) {
    const [result] = await pool.query(
      'INSERT INTO propostas_valores (proposta_id, valor, moeda) VALUES (?, ?, ?)',
      [propostaId, valor, moeda]
    );
    return { id: result.insertId };
  },
  async saveTipoIntervencao({ propostaId, tiposSelecionados }) {
    // Supondo que tiposSelecionados é array
    for (const tipo of tiposSelecionados) {
      await pool.query(
        'INSERT INTO propostas_tipo_intervencao (proposta_id, tipo_intervencao) VALUES (?, ?)',
        [propostaId, tipo]
      );
    }
    return { success: true };
  },
};
