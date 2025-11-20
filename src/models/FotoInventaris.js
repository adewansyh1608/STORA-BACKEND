const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const FotoInventaris = sequelize.define('FotoInventaris', {
  ID_Foto_Inventaris: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID_Foto_Inventaris'
  },
  ID_Inventaris: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'ID_Inventaris',
    references: {
      model: 'Inventaris',
      key: 'ID_Inventaris'
    }
  },
  Foto: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'Foto'
  },
  isSynced: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'isSynced'
  }
}, {
  tableName: 'Foto_Inventaris',
  timestamps: true
});

module.exports = FotoInventaris;
