/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Service.hasMany(models.Appointment, {
        as: 'appointment1',
        foreignKey: 'serviceId',
      }),
        Service.belongsToMany(models.Kapster, {
          through: 'Service_Kapster',
        })
    }
  }
  Service.init(
    {
      serviceName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      isActive: {
        allowNull: false,
        defaultValue: true,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: 'Service',
    },
  )
  return Service
}
