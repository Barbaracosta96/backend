const { Processo, TipoIntervencao, Tecnico, Operador, Moeda } = require('../models');
const { Op } = require('sequelize');

exports.findAll = async (req, res) => {
    try {
        const processos = await Processo.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(processos);
    } catch (err) {
        console.error('Erro ao buscar processos:', err);
        res.status(500).json({
            message: err.message || 'Ocorreu um erro ao buscar os processos.'
        });
    }
};

exports.findOne = async (req, res) => {
    const { id } = req.params;
    try {
        const processo = await Processo.findByPk(id, {
            include: [
                { model: TipoIntervencao },
                { model: Tecnico, as: 'tecnicoPrincipal' },
                { model: Tecnico, as: 'segundoTecnico' },
                { model: Operador },
                { model: Moeda }
            ]
        });
        if (!processo) {
            return res.status(404).json({
                message: 'Processo não encontrado.'
            });
        }
        res.json(processo);
    } catch (err) {
        console.error('Erro ao buscar processo:', err);
        res.status(500).json({
            message: err.message || 'Ocorreu um erro ao buscar o processo.'
        });
    }
};

exports.findByFreguesiaAndDates = async (req, res) => {
    const { freguesia, dataInicio, dataFim } = req.query;
    try {
        const where = {};
        if (freguesia) {
            where.FREGUESIA = { [Op.like]: `%${freguesia}%` };
        }
        if (dataInicio && dataFim) {
            where.DATACONTRA = {
                [Op.between]: [dataInicio, dataFim]
            };
        }
        const processos = await Processo.findAll({ where });
        res.json(processos);
    } catch (err) {
        console.error('Erro ao buscar processos:', err);
        res.status(500).json({
            message: err.message || 'Ocorreu um erro ao buscar os processos.'
        });
    }
};

exports.create = async (req, res) => {
    try {
        const processo = await Processo.create(req.body);
        res.status(201).json(processo);
    } catch (err) {
        console.error('Erro ao criar processo:', err);
        res.status(500).json({
            message: err.message || 'Ocorreu um erro ao criar o processo.'
        });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    try {
        const processo = await Processo.findByPk(id);
        if (!processo) {
            return res.status(404).json({
                message: 'Processo não encontrado.'
            });
        }
        await processo.update(req.body);
        res.json(processo);
    } catch (err) {
        console.error('Erro ao atualizar processo:', err);
        res.status(500).json({
            message: err.message || 'Ocorreu um erro ao atualizar o processo.'
        });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const processo = await Processo.findByPk(id);
        if (!processo) {
            return res.status(404).json({
                message: 'Processo não encontrado.'
            });
        }
        await processo.destroy();
        res.json({ message: 'Processo excluído com sucesso.' });
    } catch (err) {
        console.error('Erro ao excluir processo:', err);
        res.status(500).json({
            message: err.message || 'Ocorreu um erro ao excluir o processo.'
        });
    }
};

exports.getTiposIntervencao = async (req, res) => {
    try {
        const tipos = await TipoIntervencao.findAll();
        res.json(tipos);
    } catch (err) {
        console.error('Erro ao buscar tipos de intervenção:', err);
        res.status(500).json({
            message: err.message || 'Ocorreu um erro ao buscar os tipos de intervenção.'
        });
    }
};

exports.getTecnicos = async (req, res) => {
    try {
        const tecnicos = await Tecnico.findAll();
        res.json(tecnicos);
    } catch (err) {
        console.error('Erro ao buscar técnicos:', err);
        res.status(500).json({
            message: err.message || 'Ocorreu um erro ao buscar os técnicos.'
        });
    }
};

exports.getOperadores = async (req, res) => {
    try {
        const operadores = await Operador.findAll();
        res.json(operadores);
    } catch (err) {
        console.error('Erro ao buscar operadores:', err);
        res.status(500).json({
            message: err.message || 'Ocorreu um erro ao buscar os operadores.'
        });
    }
};

exports.getMoedas = async (req, res) => {
    try {
        const moedas = await Moeda.findAll();
        res.json(moedas);
    } catch (err) {
        console.error('Erro ao buscar moedas:', err);
        res.status(500).json({
            message: err.message || 'Ocorreu um erro ao buscar as moedas.'
        });
    }
};
