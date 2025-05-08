const pool = require('../db/connection');

module.exports = {
  async getAll() { 
    // Modifique a query para buscar apenas processos com ESTADO = 'ABERTO' (ou similar)
    // E mapeie os nomes das colunas para camelCase para o frontend
    const [rows] = await pool.query(
        'SELECT id, PROPOSTA as proposta, VERSAO as versao, ANO as ano, NOM_CLI as nomeCliente, '+
        'DATAPROP as dataProposta, DES_OBR as descricaoObra, LOC_OBR as localObra, '+
        'VALOR as valor, ESTADO as estado ' + // Adicione outros campos necessários
        'FROM abrobra WHERE ESTADO = ?', ['A'] // 'A' para Aberto, por exemplo
    ); 
    return rows; 
  },
  async getById(id) { 
    // Mapeamento similar se for buscar um específico
    const [rows] = await pool.query(
        'SELECT id, PROPOSTA as proposta, NOM_CLI as nomeCliente, ... FROM abrobra WHERE id = ? AND ESTADO = ?', 
        [id, 'A']
    ); 
    return rows[0]; 
  },
  // ... (filter, create, update, remove para 'processosAbertos' se necessário)
  // A lógica de 'create' e 'update' em processosAbertosController.js que força
  // data.ESTADO = 'ABERTO' está correta para garantir que só se manipulem processos abertos.
  // O validador 'processosAbertosValidator.js' também deve ser ajustado para camelCase.
};