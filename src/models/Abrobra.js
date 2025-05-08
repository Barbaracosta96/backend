const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Abrobra = sequelize.define('abrobra', {
    // Campos da tabela
    FREGUESIA: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: 'Nome da freguesia'
    },
    DATACONTRA: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Data do contrato'
    },
    DATAP_INI: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Data de início prevista'
    },
    DATAP_FIM: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Data de fim prevista'
    },
    DTPINITRAB: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Data de início do trabalho prevista'
    },
    DTPFIMTRAB: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Data de fim do trabalho prevista'
    },
    DTRINITRAB: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Data de início real do trabalho'
    },
    DTRFIMTRAB: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Data de fim real do trabalho'
    },
    REGISTO: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
      comment: 'Número de registro (chave primária)'
    },
    DATAREG: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Data de registro'
    },
    ALTREGISTO: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Registro de alteração'
    },
    ALTDATAREG: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Data de alteração do registro'
    },
    T1: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Tipo de trabalho 1'
    },
    T2: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Tipo de trabalho 2'
    },
    T3: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Tipo de trabalho 3'
    },
    T4: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Tipo de trabalho 4'
    },
    T5: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Tipo de trabalho 5'
    },
    T6: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Tipo de trabalho 6'
    },
    T7: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Tipo de trabalho 7'
    },
    T8: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Tipo de trabalho 8'
    },
    T9: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Tipo de trabalho 9'
    },
    VALOR: {
      type: DataTypes.DECIMAL(18, 3),
      allowNull: true,
      comment: 'Valor do contrato'
    },
    TECNICO: {
      type: DataTypes.STRING(40),
      allowNull: true,
      comment: 'Nome do técnico responsável'
    },
    CDTECNICO: {
      type: DataTypes.STRING(3),
      allowNull: true,
      comment: 'Código do técnico'
    },
    TECNICO2: {
      type: DataTypes.STRING(40),
      allowNull: true,
      comment: 'Nome do técnico secundário'
    },
    CDTECNICO2: {
      type: DataTypes.STRING(3),
      allowNull: true,
      comment: 'Código do técnico secundário'
    },
    CDOPERADOR: {
      type: DataTypes.STRING(3),
      allowNull: true,
      comment: 'Código do operador'
    },
    EMPREITADA: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Indica se é uma empreitada'
    },
    OBRAPUB: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Indica se é uma obra pública'
    },
    NOMEFACTUR: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Nome para faturação'
    },
    MORADA: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Morada/Endereço'
    },
    CONTRIBU: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'Número de contribuinte'
    },
    VALORPROP: {
      type: DataTypes.STRING(13),
      allowNull: true,
      comment: 'Valor da proposta'
    },
    MOEDA: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Código da moeda'
    },
    PROPOSTA: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Número da proposta'
    },
    VERSAO: {
      type: DataTypes.STRING(2),
      allowNull: true,
      comment: 'Versão'
    },
    DATAPROP: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Data da proposta'
    },
    CONCELHO: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: 'Concelho'
    },
    DISTRITO: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: 'Distrito'
    },
    EMAIL: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Endereço de e-mail'
    },
    LATITUDE: {
      type: DataTypes.STRING(12),
      allowNull: true,
      comment: 'Latitude geográfica'
    },
    LONGITUDE: {
      type: DataTypes.STRING(12),
      allowNull: true,
      comment: 'Longitude geográfica'
    }
  }, {
    tableName: process.env.TABELA || 'abrobra',
    timestamps: false,
    freezeTableName: true,
    underscored: false, // Não usar snake_case para nomes de colunas
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });

  // Hook para logging de operações
  Abrobra.addHook('afterFind', (result) => {
    if (result) {
      console.log(`Abrobra: ${Array.isArray(result) ? result.length : 1} registro(s) encontrado(s)`);
    }
  });

  return Abrobra;
};
