const pool = require('../db/connection'); 
const logger = require('../utils/logger');

const mapToDbModel = (dataFromFrontend) => {
    return {
        cliente_nome: dataFromFrontend.client,
        tipo_intervencao_id: dataFromFrontend.tipoIntervencao,
        descricao_processo: dataFromFrontend.descricao,
        local_processo: dataFromFrontend.local,
        numero_proposta_origem: dataFromFrontend.proposalNumber,
        tecnico_id: dataFromFrontend.tecnico,
        data_adjudicacao_proposta: dataFromFrontend.adjudicationDate,
        status_processo: dataFromFrontend.status,
        data_abertura_efetiva: dataFromFrontend.dataAbertura
    };
};

const mapToFrontendModel = (dataFromDb) => {
    if (!dataFromDb) return null;
    return {
        id: dataFromDb.id, 
        client: dataFromDb.cliente_nome,
        tipoIntervencao: dataFromDb.tipo_intervencao_id,
        descricao: dataFromDb.descricao_processo,
        local: dataFromDb.local_processo,
        proposalNumber: dataFromDb.numero_proposta_origem,
        tecnico: dataFromDb.tecnico_id,
        adjudicationDate: dataFromDb.data_adjudicacao_proposta,
        status: dataFromDb.status_processo,
        dataAbertura: dataFromDb.data_abertura_efetiva,
        numero: dataFromDb.id, 
    };
};

module.exports = {
  async create(data) {
    const dbData = mapToDbModel(data);
    const [result] = await pool.query('INSERT INTO processos SET ?', [dbData]);
    logger.info('ProcessosService: Novo processo inserido no banco', { id: result.insertId });
    return { id: result.insertId, ...data }; 
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM processos WHERE id = ?', [id]);
    return mapToFrontendModel(rows[0]);
  }
};