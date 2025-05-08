const db = require('../db/connection');
const logger = require('../utils/logger');

class TiposIntervencaoService {
  async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM tipos_intervencao WHERE ativo = 1 ORDER BY nome');
      return rows;
    } catch (error) {
      logger.error('Erro ao buscar tipos de intervenção', { error });
      throw new Error('Não foi possível carregar os tipos de intervenção');
    }
  }

  async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM tipos_intervencao WHERE id = ? AND ativo = 1', [id]);
      return rows[0] || null;
    } catch (error) {
      logger.error('Erro ao buscar tipo de intervenção por ID', { id, error });
      throw new Error(`Não foi possível encontrar o tipo de intervenção com ID ${id}`);
    }
  }

  async create(tipoIntervencao) {
    try {
      const [result] = await db.query('INSERT INTO tipos_intervencao SET ?', [tipoIntervencao]);
      return result.insertId;
    } catch (error) {
      logger.error('Erro ao criar tipo de intervenção', { tipoIntervencao, error });
      throw new Error('Não foi possível criar o tipo de intervenção');
    }
  }

  async update(id, tipoIntervencao) {
    try {
      await db.query('UPDATE tipos_intervencao SET ? WHERE id = ?', [tipoIntervencao, id]);
      return true;
    } catch (error) {
      logger.error('Erro ao atualizar tipo de intervenção', { id, tipoIntervencao, error });
      throw new Error(`Não foi possível atualizar o tipo de intervenção com ID ${id}`);
    }
  }

  async delete(id) {
    try {
      await db.query('UPDATE tipos_intervencao SET ativo = 0 WHERE id = ?', [id]);
      return true;
    } catch (error) {
      logger.error('Erro ao desativar tipo de intervenção', { id, error });
      throw new Error(`Não foi possível desativar o tipo de intervenção com ID ${id}`);
    }
  }
}

module.exports = new TiposIntervencaoService();
