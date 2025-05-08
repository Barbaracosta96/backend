exports.create = async (req, res, next) => {
  try {
    const propostaId = req.params.propostaId || req.body.propostaId; // propostaId vindo da URL ou corpo
    if (!propostaId) {
        logger.warn('TrabalhoRealizadoController: propostaId não fornecido.');
        return res.status(400).json({ error: 'ID da Proposta é obrigatório.' });
    }
    
    const { dataInicio, dataFim, horasRealizadas, descricaoTrabalho, observacoes } = req.body;
    const trabalhoData = {
        proposta_id: propostaId,
        data_inicio: dataInicio,
        data_fim: dataFim,
        horas_realizadas: horasRealizadas,
        descricao_trabalho: descricaoTrabalho,
        observacoes_trabalho: observacoes
    };
    
    logger.info(`TrabalhoRealizadoController: Criando trabalho realizado para proposta ID: ${propostaId}`, trabalhoData);
    const createdTrabalho = await service.create(trabalhoData);
    logger.info('TrabalhoRealizadoController: Trabalho realizado criado:', createdTrabalho);
    res.status(201).json(createdTrabalho);
  } catch (error) {
    logger.error('TrabalhoRealizadoController: Erro ao criar trabalho realizado:', error);
    next(error);
  }
};
