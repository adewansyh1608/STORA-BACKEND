const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// Initialize Sequelize (you'll need to configure this)
const sequelize = new Sequelize(
  process.env.DB_NAME || 'stora_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

// User Model
const User = sequelize.define('User', {
  ID_User: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nama_User: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  isSynced: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isLoggedIn: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'Users',
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.Password) {
        const salt = await bcrypt.genSalt(10);
        user.Password = await bcrypt.hash(user.Password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('Password')) {
        const salt = await bcrypt.genSalt(10);
        user.Password = await bcrypt.hash(user.Password, salt);
      }
    }
  }
});

// Instance method to compare password
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.Password);
};

module.exports = {
  sequelize,
  User
};
