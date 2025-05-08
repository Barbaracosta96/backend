const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Operador = sequelize.define('operador', {
    CDOPERADOR: {
      type: DataTypes.STRING(3),
      primaryKey: true,
      allowNull: false,
      comment: 'Código do operador'
    },
    NOME: {
      type: DataTypes.STRING(40),
      allowNull: true,
      comment: 'Nome do operador'
    }
  }, {
    tableName: 'operador',
    timestamps: false,
    freezeTableName: true
  });

  Operador.associate = (models) => {
    Operador.hasMany(models.Abrobra, {
      foreignKey: 'CDOPERADOR',
      as: 'obras'
    });
  };

  return Operador;
};
