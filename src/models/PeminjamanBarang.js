const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const PeminjamanBarang = sequelize.define('PeminjamanBarang', {
  ID_Peminjaman_Barang: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID_Peminjaman_Barang'
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
  ID_Inventaris: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'ID_Inventaris',
    references: {
      model: 'Inventaris',
      key: 'ID_Inventaris'
    }
  },
  Jumlah: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'Jumlah',
    validate: {
      min: 1
    }
  },
  isSynced: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'isSynced'
  }
}, {
  tableName: 'Peminjaman_Barang',
  timestamps: true
});

module.exports = PeminjamanBarang;
