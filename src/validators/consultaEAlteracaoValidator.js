const pool = require('../db/connection');

// Assumindo que a tabela 'abrobra' tem uma coluna 'id' auto-incrementável como chave primária.
// E que os nomes das colunas são IGUAIS às chaves do formData (processo, adjudicationDate, cliente, etc.)
// Se os nomes das colunas forem diferentes, você precisará ajustar as queries.
// Ex: se no banco é 'NOME_CLIENTE' e no formData é 'cliente', na query use 'NOME_CLIENTE = ?' e passe data.cliente

const { body } = require('express-validator');

// Validador para criação/atualização
const createOrUpdate = [
  body('processo').notEmpty().withMessage('O campo processo é obrigatório'),
  body('cliente').notEmpty().withMessage('O campo cliente é obrigatório'),
  body('descricao').notEmpty().withMessage('O campo descricao é obrigatório'),
  // Adicione mais validações conforme necessário
];

module.exports = {
  async getAll(queryParams = {}) { // Modificado para aceitar queryParams
    let query = 'SELECT * FROM abrobra WHERE 1=1';
    const params = [];

    // Filtros básicos baseados nos campos de texto (exemplo)
    if (queryParams.processo) {
      query += ' AND processo LIKE ?';
      params.push(`%${queryParams.processo}%`);
    }
    if (queryParams.cliente) {
      query += ' AND cliente LIKE ?';
      params.push(`%${queryParams.cliente}%`);
    }
    if (queryParams.descricao) {
      query += ' AND descricao LIKE ?';
      params.push(`%${queryParams.descricao}%`);
    }
    if (queryParams.local) {
      query += ' AND local LIKE ?';
      params.push(`%${queryParams.local}%`);
    }
    if (queryParams.adjudicationDate) {
        query += ' AND DATE(adjudicationDate) = ?'; // Comparar apenas a data
        params.push(queryParams.adjudicationDate);
    }
    if (queryParams.tecnico && queryParams.tecnico !== 'Qualquer') {
      query += ' AND tecnico = ?';
      params.push(queryParams.tecnico);
    }
    if (queryParams.tipoIntervencao && queryParams.tipoIntervencao !== 'Qualquer') {
        query += ' AND tipoIntervencao = ?';
        params.push(queryParams.tipoIntervencao);
    }


    // Ordenação (radioOptionFila01 e radioOptionFila02)
    let orderByField = 'id'; // Campo padrão para ordenação
    if (queryParams.ordenacao) {
      switch (queryParams.ordenacao) {
        case 'option1': orderByField = 'adjudicationDate'; break; // Ano (assumindo que é pela data)
        case 'option2': orderByField = 'cliente'; break;
        case 'option3': orderByField = 'descricao'; break;
        case 'option4': orderByField = 'local'; break;
        // Adicione mais casos conforme necessário
        default: orderByField = 'id';
      }
    }

    let orderDirection = 'DESC'; // Descendente por padrão (option6)
    if (queryParams.tipoOrdenacao === 'option5') { // Ascendente
      orderDirection = 'ASC';
    }

    query += ` ORDER BY ${orderByField} ${orderDirection}`;

    // Tipo de Consulta (radioOptionFila03) - pode modificar os campos selecionados
    // Exemplo: se for 'Resumo', selecionar menos colunas.
    // Para simplificar, vamos selecionar todas por enquanto.
    // if (queryParams.tipoConsulta === 'option7') { // Resumo
    //   query = query.replace('*', 'id, processo, cliente, adjudicationDate');
    // }

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async getById(id) {
    // Certifique-se que sua tabela tem uma coluna 'id' ou ajuste o nome da coluna
    const [rows] = await pool.query('SELECT * FROM abrobra WHERE id = ?', [id]);
    return rows[0];
  },

  async create(data) {
    // Remova os campos de filtro/ordenação antes de inserir, se eles estiverem no objeto 'data'
    const { ordenacao, tipoOrdenacao, tipoConsulta, ...insertData } = data;
    const [result] = await pool.query('INSERT INTO abrobra SET ?', [insertData]);
    return { id: result.insertId, ...insertData };
  },

  async update(id, data) {
    const { ordenacao, tipoOrdenacao, tipoConsulta, ...updateData } = data;
    const [result] = await pool.query('UPDATE abrobra SET ? WHERE id = ?', [updateData, id]);
    if (result.affectedRows === 0) {
        return null; // Nenhum registro encontrado para atualizar
    }
    return { id, ...updateData };
  },

  async remove(id) {
    const [result] = await pool.query('DELETE FROM abrobra WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
        return null; // Nenhum registro encontrado para deletar
    }
    return { id };
  }
  ,
  createOrUpdate
};