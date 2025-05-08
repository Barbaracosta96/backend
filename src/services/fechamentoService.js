const pool = require('../db/connection');

// Seu service original interage com a tabela 'abrobra'
// Vamos assumir que o 'numeroProcesso' corresponde à coluna 'PROPOSTA' em 'abrobra'
// e que existe uma coluna 'ESTADO' que será atualizada.

module.exports = {
  async closeProcessByNumber(numeroProcesso, novoEstado = 'F') {
    try {
      // Assumindo que 'numeroProcesso' é o valor para a coluna 'PROPOSTA'
      // E que 'ESTADO' é a coluna que indica o status do processo
      const [result] = await pool.query(
        'UPDATE abrobra SET ESTADO = ? WHERE PROPOSTA = ?',
        [novoEstado, numeroProcesso]
      );

      if (result.affectedRows === 0) {
        return null; // Nenhum processo encontrado com esse número ou já estava nesse estado
      }
      // Retornar os dados do processo atualizado pode ser útil
      const [updatedRows] = await pool.query('SELECT * FROM abrobra WHERE PROPOSTA = ?', [numeroProcesso]);
      return updatedRows[0];
    } catch (error) {
      console.error("Erro no service ao fechar processo:", error);
      throw error; // Propaga o erro para o controller
    }
  },
  // ... (suas funções getAll, getById, create, update, remove para 'abrobra') ...

  async getAll() {
    const [rows] = await pool.query('SELECT * FROM abrobra'); // Exemplo
    return rows;
  },

  async getById(id) {
    // Supondo que 'id' é a chave primária numérica da tabela abrobra
    const [rows] = await pool.query('SELECT * FROM abrobra WHERE id = ?', [id]);
    return rows[0];
  },
  
  async filter(query) {
    // Implemente sua lógica de filtro para abrobra aqui
    // Exemplo:
    let sql = 'SELECT * FROM abrobra WHERE 1=1';
    const params = [];
    if (query.PROPOSTA) { // Assumindo que PROPOSTA é um campo em abrobra
        sql += ' AND PROPOSTA LIKE ?';
        params.push(`%${query.PROPOSTA}%`);
    }
    // Adicione outros filtros conforme necessário
    const [rows] = await pool.query(sql, params);
    return rows;
  },


  async closeProcessByNumber(numeroProcesso, novoEstado = 'F') { // 'F' para Fechado, por exemplo
    try {
      // Assumindo que 'numeroProcesso' é o valor para a coluna 'PROPOSTA'
      // E que 'ESTADO' é a coluna que indica o status do processo
      const [result] = await pool.query(
        'UPDATE abrobra SET ESTADO = ? WHERE PROPOSTA = ?',
        [novoEstado, numeroProcesso]
      );

      if (result.affectedRows === 0) {
        return null; // Nenhum processo encontrado com esse número ou já estava nesse estado
      }
      // Retornar os dados do processo atualizado pode ser útil
      const [updatedRows] = await pool.query('SELECT * FROM abrobra WHERE PROPOSTA = ?', [numeroProcesso]);
      return updatedRows[0];

    } catch (error) {
      console.error("Erro no service ao fechar processo:", error);
      throw error; // Propaga o erro para o controller
    }
  },

  // Manter as funções originais do service se forem usadas por outras partes do controller
  async create(data) {
    // Exemplo de mapeamento de camelCase para SNAKE_CASE (se necessário para 'abrobra')
    // const mappedData = { PROPOSTA: data.proposta, NOM_CLI: data.nomeCliente, ... };
    // const [result] = await pool.query('INSERT INTO abrobra SET ?', [mappedData]);
    const [result] = await pool.query('INSERT INTO abrobra SET ?', [data]); // Se abrobra já usa os nomes de `data`
    return { id: result.insertId, ...data };
  },

  async update(id, data) {
    // const mappedData = { ... };
    // await pool.query('UPDATE abrobra SET ? WHERE id = ?', [mappedData, id]);
    const [result] = await pool.query('UPDATE abrobra SET ? WHERE id = ?', [data, id]); // Se `id` for a PK
    if (result.affectedRows === 0) return null;
    return { id, ...data };
  },

  async remove(id) {
    const [result] = await pool.query('DELETE FROM abrobra WHERE id = ?', [id]);
    if (result.affectedRows === 0) return null;
    return { id };
  }
};