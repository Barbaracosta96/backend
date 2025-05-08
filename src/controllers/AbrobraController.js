const { apiResponse } = require('../utils/apiResponse');
const { handleApiError } = require('../utils/errorHandler');
const { sanitizeInput, validateFields } = require('../utils/validator');
const logger = require('../utils/logger');
const { Abrobra } = require('../models');
const { invalidateCache } = require('../cache');
const { getCacheKey, getCachedData } = require('../services/cache');
const { Op } = require('sequelize');

class AbrobraController {
  async findAll(req, res) {
    try {
      const registros = await Abrobra.findAll();
      return apiResponse.success(res, registros);
    } catch (error) {
      return handleApiError(error, req, res);
    }
  }

  async findOne(req, res) {
    try {
      const { id } = req.params;
      logger.info(`Buscando processo com ID: ${id}`);
      
      if (!id) {
        logger.warn('ID não fornecido na requisição');
        return res.status(400).json({ error: 'ID do processo é obrigatório' });
      }
      
      const cacheKey = getCacheKey('abrobra:one', { id });
      
      const abrobra = await getCachedData(cacheKey, async () => {
        const result = await Abrobra.findByPk(id);
        if (!result) {
          throw new Error('Processo não encontrado');
        }
        return result;
      });

      logger.info(`Processo encontrado: ${id}`);
      res.json(abrobra);
    } catch (error) {
      logger.error(`Erro ao buscar processo ${req.params.id}:`, error);
      if (error.message === 'Processo não encontrado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ 
          error: 'Erro ao buscar processo',
          message: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
        });
      }
    }
  }

  async create(req, res) {
    try {
      const sanitizedData = sanitizeInput(req.body);
      const { REGISTO } = sanitizedData;

      logger.info(`Tentando criar processo com registro: ${REGISTO}`);

      if (!REGISTO) {
        return apiResponse.validationError(res, {
          message: 'O campo REGISTO é obrigatório'
        });
      }

      // Verificar se já existe um processo com o mesmo REGISTO
      const existingProcesso = await Abrobra.findOne({ where: { REGISTO } });
      if (existingProcesso) {
        logger.warn(`Já existe um processo com o REGISTO: ${REGISTO}`);
        return apiResponse.error(res, {
          message: 'Já existe um processo com este registro'
        });
      }

      const abrobra = await Abrobra.create(sanitizedData);
      await invalidateCache('abrobra:');
      
      logger.info(`Novo processo criado: ${REGISTO}`);
      return apiResponse.created(res, abrobra);
    } catch (error) {
      logger.error('Erro ao criar processo:', error);
      return handleApiError(error, req, res);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const sanitizedData = sanitizeInput(req.body);

      const registro = await Abrobra.findByPk(id);
      if (!registro) {
        return apiResponse.notFound(res, 'Registro não encontrado');
      }

      await registro.update(sanitizedData);
      await invalidateCache('abrobra:');

      logger.info(`Registro ${id} atualizado com sucesso`);
      return apiResponse.success(res, registro);
    } catch (error) {
      logger.error('Erro ao atualizar registro:', error);
      return handleApiError(error, req, res);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const registro = await Abrobra.findByPk(id);
      if (!registro) {
        return apiResponse.notFound(res, 'Registro não encontrado');
      }

      await registro.destroy();
      await invalidateCache('abrobra:');

      logger.info(`Registro ${id} deletado com sucesso`);
      return apiResponse.success(res, null, 'Registro deletado com sucesso');
    } catch (error) {
      logger.error('Erro ao deletar registro:', error);
      return handleApiError(error, req, res);
    }
  }

  async findByFreguesiaAndDates(req, res) {
    try {
      const { freguesia, dataInicio, dataFim } = req.query;
      logger.info(`Buscando processos por freguesia: ${freguesia} e datas: ${dataInicio} a ${dataFim}`);

      if (!freguesia || !dataInicio || !dataFim) {
        logger.warn('Parâmetros incompletos na busca por freguesia e datas');
        return res.status(400).json({ error: 'Freguesia, data início e data fim são obrigatórios' });
      }

      const cacheKey = getCacheKey('abrobra:search', { freguesia, dataInicio, dataFim });
      const abrobras = await getCachedData(cacheKey, async () => {
        return await Abrobra.findAll({
          where: {
            FREGUESIA: { [Op.like]: `%${freguesia}%` },
            DATACONTRA: {
              [Op.between]: [new Date(dataInicio), new Date(dataFim)]
            }
          },
          order: [['DATACONTRA', 'DESC']]
        });
      });

      logger.info(`Encontrados ${abrobras.length} processos na busca por freguesia e datas`);
      res.json(abrobras);
    } catch (error) {
      logger.error('Erro ao buscar processos por freguesia e datas:', error);
      res.status(500).json({ 
        error: 'Erro ao buscar processos',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
      });
    }
  }

  async search(req, res) {
    try {
      const { freguesia } = req.query;
      logger.info(`Buscando processos por freguesia: ${freguesia}`);

      if (!freguesia) {
        logger.warn('Freguesia não fornecida na busca');
        return res.status(400).json({ error: 'Freguesia é obrigatória' });
      }

      const cacheKey = getCacheKey('abrobra:search', { freguesia });
      const abrobras = await getCachedData(cacheKey, async () => {
        return await Abrobra.findAll({
          where: {
            FREGUESIA: { [Op.like]: `%${freguesia}%` }
          },
          order: [['DATACONTRA', 'DESC']]
        });
      });

      logger.info(`Encontrados ${abrobras.length} processos na busca por freguesia`);
      res.json(abrobras);
    } catch (error) {
      logger.error('Erro ao buscar processos:', error);
      res.status(500).json({ 
        error: 'Erro ao buscar processos',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
      });
    }
  }
}

module.exports = new AbrobraController();
