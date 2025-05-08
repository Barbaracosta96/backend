const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TipoIntervencao = sequelize.define('tipointervencao', {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    CODIGO: {
      type: DataTypes.STRING(2),
      allowNull: false,
      unique: true
    },
    DESCRICAO: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'tipointervencao',
    timestamps: false,
    freezeTableName: true
  });

  TipoIntervencao.associate = (models) => {
    // As associações serão feitas através dos campos T1-T9 na tabela abrobra
    // que são booleanos indicando quais tipos de intervenção se aplicam
  };

  return TipoIntervencao;
};
