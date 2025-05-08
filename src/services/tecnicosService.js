const db = require('../db/connection');
const db = require('../db/connection');
const logger = require('../utils/logger');

class TecnicosService {
  async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM tecnicos WHERE ativo = 1 ORDER BY nome');
      return rows;
    } catch (error) {
      logger.error('Erro ao buscar técnicos', { error });
      throw new Error('Não foi possível carregar os técnicos');
    }
  }

  async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM tecnicos WHERE id = ? AND ativo = 1', [id]);
      return rows[0] || null;
    } catch (error) {
      logger.error('Erro ao buscar técnico por ID', { id, error });
      throw new Error(`Não foi possível encontrar o técnico com ID ${id}`);
    }
  }

  async create(tecnico) {
    try {
      const [result] = await db.query('INSERT INTO tecnicos SET ?', [tecnico]);
      return result.insertId;
    } catch (error) {
      logger.error('Erro ao criar técnico', { tecnico, error });
      throw new Error('Não foi possível criar o técnico');
    }
  }

  async update(id, tecnico) {
    try {
      await db.query('UPDATE tecnicos SET ? WHERE id = ?', [tecnico, id]);
      return true;
    } catch (error) {
      logger.error('Erro ao atualizar técnico', { id, tecnico, error });
      throw new Error(`Não foi possível atualizar o técnico com ID ${id}`);
    }
  }

  async delete(id) {
    try {
      await db.query('UPDATE tecnicos SET ativo = 0 WHERE id = ?', [id]);
      return true;
    } catch (error) {
      logger.error('Erro ao desativar técnico', { id, error });
      throw new Error(`Não foi possível desativar o técnico com ID ${id}`);
    }
  }
}

module.exports = new TecnicosService();
