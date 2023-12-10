'use strict';
const {
  Model
} = require('sequelize');
const kapster = require('./kapster');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Appointment.belongsTo(models.User, {
        as: "user",
        foreignKey: 'userId'
      }), 
      Appointment.belongsTo(models.Kapster, {
        as: 'kapster',
        foreignKey: 'kapsterId'
      }),
      Appointment.belongsTo(models.Service, {
        as: 'service',
        foreignKey: 'serviceId'
      })
    }
  }
  Appointment.init({
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    kapsterId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    serviceId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATE,
      validate: {
        isDate: true
      }
    },
    time: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM('Booked', 'Completed', 'Cancelled'),
      defaultValue: ['Booked']
    }
  }, {
    sequelize,
    modelName: 'Appointment',
  });
  return Appointment;
};