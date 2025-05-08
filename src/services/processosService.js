const pool = require('../db/connection');

module.exports = {
  async getAll() { 
    // Mapear colunas do DB para camelCase no retorno se necessário
    const [rows] = await pool.query('SELECT PROPOSTA as proposta, NOM_CLI as nomeCliente, DATAPROP as dataAdjudicacao, VALOR as valor, ESTADO as estado, id FROM abrobra'); // Ajuste a query e tabela
    return rows; 
  },
  async getById(id) { 
    // Ajuste a query e tabela, e o mapeamento de retorno
    const [rows] = await pool.query('SELECT PROPOSTA as proposta, NOM_CLI as nomeCliente, DATAPROP as dataAdjudicacao, VALOR as valor, ESTADO as estado, id FROM abrobra WHERE id = ?', [id]); 
    return rows[0]; 
  },
  // ... filter ...

  async create(data) {
    // `data` aqui já vem com os nomes do validador (proposta, nomeCliente, etc.)
    // Mapear para os nomes das colunas do banco de dados (SNAKE_CASE_UPPER)
    const dbData = {
      PROPOSTA: data.proposta,
      VERSAO: data.versao, // Adicionar coluna VERSAO na tabela se necessário
      ANO: data.ano,       // Adicionar coluna ANO na tabela se necessário
      NOM_CLI: data.nomeCliente,
      DATAPROP: data.dataAdjudicacao, // Ou DATA_ADJUDICACAO
      VALOR: data.valor,
      ESTADO: data.estado,
      // Adicionar outros campos se a tabela 'abrobra' (ou 'processos') os tiver
      // Ex: DES_OBR, LOC_OBR, etc., se vierem de outro formulário, precisarão ser incluídos ou ter default
    };

    // Remover chaves com valor undefined para não dar erro no INSERT
    Object.keys(dbData).forEach(key => dbData[key] === undefined && delete dbData[key]);


    // Supondo que a tabela é 'abrobra' e tem estas colunas
    const [result] = await pool.query('INSERT INTO abrobra SET ?', [dbData]);
    
    // Retornar o objeto criado com o ID e os dados como foram recebidos (camelCase)
    return { id: result.insertId, ...data }; 
  },
  async update(id, data) { 
    const dbData = {
      PROPOSTA: data.proposta,
      VERSAO: data.versao,
      ANO: data.ano,
      NOM_CLI: data.nomeCliente,
      DATAPROP: data.dataAdjudicacao,
      VALOR: data.valor,
      ESTADO: data.estado,
    };
    Object.keys(dbData).forEach(key => dbData[key] === undefined && delete dbData[key]);

    const [result] = await pool.query('UPDATE abrobra SET ? WHERE id = ?', [dbData, id]);
    if (result.affectedRows === 0) return null;
    return { id, ...data }; 
  },
  async remove(id) { 
    await pool.query('DELETE FROM abrobra WHERE id = ?', [id]); 
    return { id }; 
  }
};