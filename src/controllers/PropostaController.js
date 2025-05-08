const { Proposta } = require('../models');
const { apiResponse } = require('../utils/apiResponse');
const { handleApiError } = require('../utils/errorHandler');
const { sanitizeInput, validateFields } = require('../utils/validator');
const logger = require('../utils/logger');

class PropostaController {
  async findAll(req, res) {
    try {
      const registros = await Proposta.findAll({
        order: [['createdAt', 'DESC']]
      });
      logger.info(`Encontrados ${registros.length} registros de propostas`);
      return apiResponse.success(res, registros);
    } catch (error) {
      logger.error('Erro ao buscar propostas:', error);
      return handleApiError(error, req, res);
    }
  }

  async findOne(req, res) {
    try {
      const { id } = req.params;
      logger.info(`Buscando proposta com ID: ${id}`);
      
      const registro = await Proposta.findByPk(id);
      if (!registro) {
        return apiResponse.notFound(res, 'Proposta não encontrada');
      }
      
      return apiResponse.success(res, registro);
    } catch (error) {
      logger.error('Erro ao buscar proposta:', error);
      return handleApiError(error, req, res);
    }
  }

  async create(req, res) {
    try {
      const data = sanitizeInput(req.body);
      
      const errors = validateFields(data, [
        'descricao',
        'local',
        'tecnico',
        'tipoIntervencao'
      ]);

      if (errors.length > 0) {
        return apiResponse.validationError(res, errors);
      }

      const proposta = await Proposta.create(data);
      logger.info(`Nova proposta criada com ID: ${proposta.id}`);
      
      return apiResponse.created(res, proposta);
    } catch (error) {
      logger.error('Erro ao criar proposta:', error);
      return handleApiError(error, req, res);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = sanitizeInput(req.body);

      const proposta = await Proposta.findByPk(id);
      if (!proposta) {
        return apiResponse.notFound(res, 'Proposta não encontrada');
      }

      await proposta.update(data);
      logger.info(`Proposta ${id} atualizada com sucesso`);
      
      return apiResponse.success(res, proposta);
    } catch (error) {
      logger.error('Erro ao atualizar proposta:', error);
      return handleApiError(error, req, res);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const proposta = await Proposta.findByPk(id);
      if (!proposta) {
        return apiResponse.notFound(res, 'Proposta não encontrada');
      }

      await proposta.destroy();
      logger.info(`Proposta ${id} excluída com sucesso`);
      
      return apiResponse.success(res, null, 'Proposta excluída com sucesso');
    } catch (error) {
      logger.error('Erro ao excluir proposta:', error);
      return handleApiError(error, req, res);
    }
  }

  async search(req, res) {
    try {
      const { tecnico, tipoIntervencao, ordenacao, tipoOrdenacao } = req.query;
      
      const where = {};
      if (tecnico) where.tecnico = tecnico;
      if (tipoIntervencao) where.tipoIntervencao = tipoIntervencao;

      const order = [];
      if (ordenacao && tipoOrdenacao) {
        order.push([ordenacao, tipoOrdenacao.toUpperCase()]);
      }

      const propostas = await Proposta.findAll({ where, order });
      logger.info(`Busca realizada: ${propostas.length} propostas encontradas`);
      
      return apiResponse.success(res, propostas);
    } catch (error) {
      logger.error('Erro na busca de propostas:', error);
      return handleApiError(error, req, res);
    }
  }
}

module.exports = new PropostaController();
