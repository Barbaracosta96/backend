const Fechamento = require('../models/Fechamento');
const Proposta = require('../models/Proposta');
const logger = require('../../utils/logger');

class FechamentoController {
    async findAll(req, res) {
        try {
            const fechamentos = await Fechamento.findAll({
                include: [{
                    model: Proposta,
                    attributes: ['descricao', 'local', 'tecnico']
                }],
                order: [['createdAt', 'DESC']]
            });
            res.json(fechamentos);
        } catch (error) {
            logger.error('Erro ao buscar fechamentos:', error);
            res.status(500).json({ error: 'Erro ao buscar fechamentos' });
        }
    }

    async findOne(req, res) {
        try {
            const { id } = req.params;
            const fechamento = await Fechamento.findByPk(id, {
                include: [{
                    model: Proposta,
                    attributes: ['descricao', 'local', 'tecnico']
                }]
            });

            if (!fechamento) {
                return res.status(404).json({ error: 'Fechamento não encontrado' });
            }

            res.json(fechamento);
        } catch (error) {
            logger.error('Erro ao buscar fechamento:', error);
            res.status(500).json({ error: 'Erro ao buscar fechamento' });
        }
    }

    async create(req, res) {
        try {
            const fechamento = await Fechamento.create(req.body);
            
            // Atualiza o status da proposta para 'fechada'
            await Proposta.update(
                { status: 'fechada' },
                { where: { id: req.body.propostaId } }
            );

            res.status(201).json(fechamento);
        } catch (error) {
            logger.error('Erro ao criar fechamento:', error);
            res.status(500).json({ error: 'Erro ao criar fechamento' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const [updated] = await Fechamento.update(req.body, {
                where: { id }
            });

            if (!updated) {
                return res.status(404).json({ error: 'Fechamento não encontrado' });
            }

            const fechamento = await Fechamento.findByPk(id);
            res.json(fechamento);
        } catch (error) {
            logger.error('Erro ao atualizar fechamento:', error);
            res.status(500).json({ error: 'Erro ao atualizar fechamento' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Fechamento.destroy({
                where: { id }
            });

            if (!deleted) {
                return res.status(404).json({ error: 'Fechamento não encontrado' });
            }

            res.status(204).send();
        } catch (error) {
            logger.error('Erro ao excluir fechamento:', error);
            res.status(500).json({ error: 'Erro ao excluir fechamento' });
        }
    }

    async search(req, res) {
        try {
            const { status, dataInicio, dataFim } = req.query;
            const where = {};

            if (status) {
                where.status = status;
            }

            if (dataInicio && dataFim) {
                where.dataFechamento = {
                    [Op.between]: [dataInicio, dataFim]
                };
            }

            const fechamentos = await Fechamento.findAll({
                where,
                include: [{
                    model: Proposta,
                    attributes: ['descricao', 'local', 'tecnico']
                }],
                order: [['createdAt', 'DESC']]
            });

            res.json(fechamentos);
        } catch (error) {
            logger.error('Erro na busca de fechamentos:', error);
            res.status(500).json({ error: 'Erro na busca de fechamentos' });
        }
    }
}

module.exports = new FechamentoController();
