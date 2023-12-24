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
      // Mendefinisikan asosiasi antara model Service dan KapsterService
      Service.hasOne(models.ServiceKapster, {
        foreignKey: 'serviceId',
        as: 'serviceKapster',
        sourceKey: 'id',
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
