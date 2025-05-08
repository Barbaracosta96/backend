const FechamentoService = require('../services/fechamentoService');
const PropostasService = require('../services/propostasService');
const logger = require('../utils/logger'); 
const { Op } = require('sequelize');

class FechamentoController {

    async create(req, res) {
        try {
            const { propostaId, ...fechamentoInput } = req.body;
            logger.info(`FechamentoController: Criando fechamento para proposta ID: ${propostaId}`, fechamentoInput);

            if (!propostaId) {
                logger.warn('FechamentoController: propostaId não fornecido.');
                return res.status(400).json({ error: 'ID da proposta é obrigatório.' });
            }

            const dadosParaSalvar = {
                proposta_id: propostaId, 
                data_fechamento: fechamentoInput.dataFechamento,
                valor_final: fechamentoInput.valorFinal,
                forma_pagamento: fechamentoInput.formaPagamento,
                observacoes: fechamentoInput.observacoes,
                documentos_anexados: JSON.stringify(fechamentoInput.documentosAnexados || [])
            };

            const novoFechamento = await FechamentoService.create(dadosParaSalvar);
            

            await PropostasService.updateStatus(propostaId, 'fechada');

            logger.info('FechamentoController: Fechamento criado e proposta atualizada:', novoFechamento);
            res.status(201).json(novoFechamento);
        } catch (error) {
            logger.error('FechamentoController: Erro ao criar fechamento:', error);
            const errorDetails = process.env.NODE_ENV === 'development' ? { details: error.message, stack: error.stack } : {};
            res.status(500).json({ error: 'Erro ao criar fechamento', ...errorDetails });
        }
    }

    async findAll(req, res) {
        try {
            const fechamentos = await FechamentoService.findAll(req.query); 
            res.json(fechamentos);
        } catch (error) {
            logger.error('FechamentoController: Erro ao buscar todos os fechamentos:', error);
            res.status(500).json({ error: 'Erro ao buscar fechamentos' });
        }
    }

    async findOne(req, res) {
        try {
            const { id } = req.params;
            const fechamento = await FechamentoService.findOne(id); 
            if (!fechamento) {
                return res.status(404).json({ error: 'Fechamento não encontrado' });
            }
            res.json(fechamento);
        } catch (error) {
            logger.error(`FechamentoController: Erro ao buscar fechamento ${req.params.id}:`, error);
            res.status(500).json({ error: 'Erro ao buscar fechamento' });
        }
    }

    async closeProcessByNumber(req, res) {
        try {
            const { numeroProcesso } = req.params; 
            logger.info(`FechamentoController: Recebida requisição para fechar processo: ${numeroProcesso}`);

            if (!numeroProcesso) {
                logger.warn('FechamentoController: Número do processo não fornecido para fechamento.');
                return res.status(400).json({ error: 'Número do processo é obrigatório.' });
            }


             const updated = await FechamentoService.closeProcessByNumberInAbrobra(numeroProcesso, 'F');


            if (!updated || (updated.affectedRows && updated.affectedRows[0] === 0)) { 
                logger.warn(`FechamentoController: Processo ${numeroProcesso} não encontrado para fechar ou já fechado.`);
                return res.status(404).json({ error: 'Processo não encontrado ou já fechado.' });
            }

            logger.info(`FechamentoController: Processo ${numeroProcesso} fechado com sucesso.`);
            res.json({ message: `Processo ${numeroProcesso} fechado com sucesso.`, data: updated });

        } catch (error) {
            logger.error('FechamentoController: Erro ao fechar processo por número:', error);
            res.status(500).json({ error: 'Erro ao fechar processo', details: error.message });
        }
    }

}

module.exports = new FechamentoController();