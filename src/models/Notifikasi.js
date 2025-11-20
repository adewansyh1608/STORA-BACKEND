const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Notifikasi = sequelize.define('Notifikasi', {
  ID_Notifikasi: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID_Notifikasi'
  },
  Pesan: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'Pesan'
  },
  Tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'Tanggal'
  },
  Status: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'Status'
  },
  ID_Peminjaman: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'ID_Peminjaman',
    references: {
      model: 'Peminjaman',
      key: 'ID_Peminjaman'
    }
  },
  isSynced: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'isSynced'
  }
}, {
  tableName: 'Notifikasi',
  timestamps: true
});

module.exports = Notifikasi;
