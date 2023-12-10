'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Appointment, {
        as: 'appointment2',
        foreignKey: 'userId'
      })
    }
  }
  User.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        min: 8
      }
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    number: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    photo_url: {
    allowNull: false,
    type: DataTypes.TEXT
    },
    role: {
      allowNull: false,
      type: DataTypes.ENUM('Customer', 'Admin')
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};