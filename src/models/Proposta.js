const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Proposta = sequelize.define('proposta', {
    PROPOSTA: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: 'Número da proposta'
    },
    VERSAO: {
      type: DataTypes.STRING(2),
      allowNull: true,
      comment: 'Versão da proposta'
    },
    DATAPROP: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Data da proposta'
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
    }
  }, {
    tableName: 'proposta',
    timestamps: false,
    freezeTableName: true
  });

  Proposta.associate = (models) => {
    Proposta.hasMany(models.Abrobra, {
      foreignKey: 'PROPOSTA',
      as: 'obras'
    });
  };

  return Proposta;
};
