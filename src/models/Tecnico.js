const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tecnico = sequelize.define('tecnico', {
    CDTECNICO: {
      type: DataTypes.STRING(3),
      primaryKey: true,
      allowNull: false,
      comment: 'Código do técnico'
    },
    NOME: {
      type: DataTypes.STRING(40),
      allowNull: true,
      comment: 'Nome do técnico'
    }
  }, {
    tableName: 'tecnico',
    timestamps: false,
    freezeTableName: true
  });

  Tecnico.associate = (models) => {
    Tecnico.hasMany(models.Abrobra, {
      foreignKey: 'CDTECNICO',
      as: 'obrasPrimarias'
    });
    Tecnico.hasMany(models.Abrobra, {
      foreignKey: 'CDTECNICO2',
      as: 'obrasSecundarias'
    });
  };

  return Tecnico;
};
