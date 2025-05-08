const { Abrobra, Sequelize } = require('../models'); 
const { Op } = Sequelize;
const logger = require('../utils/logger');

module.exports = {
  async getAll(queryParams = {}) {
    const whereClause = {};
    const orderClause = [];

    if (queryParams.proposta) {
      whereClause.PROPOSTA = { [Op.like]: `%${queryParams.proposta}%` };
    }
    if (queryParams.data) {
      const dateObj = new Date(queryParams.data);
      if (!isNaN(dateObj.getTime())) {
        const formattedDate = dateObj.toISOString().split('T')[0];
        whereClause.DATACONTRA = { 
          [Op.eq]: formattedDate,
        };
      }
    }
    if (queryParams.cliente) {
      whereClause[Op.or] = [
        { NOM_CLI: { [Op.like]: `%${queryParams.cliente}%` } },
        { NOMEFACTUR: { [Op.like]: `%${queryParams.cliente}%` } }
      ];
    }
    if (queryParams.descricao) {
       logger.warn("Filtro por 'descricao' não mapeado diretamente para um campo único em Abrobra.");
    }
    if (queryParams.local) {
       whereClause[Op.or] = [
        { FREGUESIA: { [Op.like]: `%${queryParams.local}%` } },
        { CONCELHO: { [Op.like]: `%${queryParams.local}%` } },
        { DISTRITO: { [Op.like]: `%${queryParams.local}%` } }
      ];
    }
    if (queryParams.tecnico && queryParams.tecnico !== 'Qualquer' && queryParams.tecnico !== '') {
      whereClause[Op.or] = [
        { TECNICO: queryParams.tecnico },
        { TECNICO2: queryParams.tecnico }
      ];
    }
    if (queryParams.tipoIntervencao && queryParams.tipoIntervencao !== 'Qualquer' && queryParams.tipoIntervencao !== '') {
      logger.warn("Filtro por 'tipoIntervencao' requer mapeamento para campos T1-T9 em Abrobra.");
    }

    let orderByField = 'REGISTO'; 
    if (queryParams.ordenacao) {
      switch (queryParams.ordenacao) {
        case 'option1': orderByField = 'DATACONTRA'; break; 
        case 'option2': orderByField = 'NOM_CLI'; break;
        case 'option3': break;
        case 'option4': orderByField = 'FREGUESIA'; break;
        default: orderByField = 'REGISTO';
      }
    }
    const orderDirection = queryParams.tipoOrdenacao === 'option6' ? 'DESC' : 'ASC';
    if (orderByField) {
      orderClause.push([orderByField, orderDirection]);
    } else if (queryParams.ordenacao === 'option3'){
       orderClause.push(['REGISTO', orderDirection]);
       logger.warn("Ordenação por 'Descrição da obra' (option3) sem campo mapeado, usando REGISTO.");
    }


    logger.debug('Consulta Abrobra com whereClause:', JSON.stringify(whereClause), 'orderClause:', orderClause);
    const rows = await Abrobra.findAll({ where: whereClause, order: orderClause });
    return rows;
  },

  async getById(id) { 
    const row = await Abrobra.findByPk(id);
    return row;
  },

  async create(data) {
    const abrobraData = {
      PROPOSTA: data.proposta,    
      DATACONTRA: data.data,    
      NOM_CLI: data.cliente,      
      FREGUESIA: data.local,      
      TECNICO: data.tecnico,       
      REGISTO: data.proposta || `REG-${Date.now()}`
    };
    Object.keys(abrobraData).forEach(key => abrobraData[key] === undefined && delete abrobraData[key]);
    
    const newRecord = await Abrobra.create(abrobraData);
    return newRecord;
  },

  async update(id, data) {
    const abrobraData = {
      PROPOSTA: data.proposta,
      DATACONTRA: data.data,
      NOM_CLI: data.cliente,
      FREGUESIA: data.local,
      TECNICO: data.tecnico,
    };
    Object.keys(abrobraData).forEach(key => abrobraData[key] === undefined && delete abrobraData[key]);

    const [affectedRows] = await Abrobra.update(abrobraData, { where: { REGISTO: id } });
    if (affectedRows === 0) {
      return null;
    }
    return await Abrobra.findByPk(id);
  },

  async remove(id) { 
    const affectedRows = await Abrobra.destroy({ where: { REGISTO: id } });
    return affectedRows > 0 ? { REGISTO: id } : null;
  }
};