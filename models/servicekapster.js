/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ServiceKapster extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static associate(models) {
      models.ServiceKapster.belongsTo(models.Service, {
        as: 'service',
        foreignKey: 'serviceId',
        sourceKey: 'serviceId',
      })

      models.ServiceKapster.belongsTo(models.Kapster, {
        as: 'kapster',
        foreignKey: 'kapsterId',
        sourceKey: 'kapsterId',
      })
    }
  }
  ServiceKapster.init(
    {
      kapsterId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Kapsters',
          key: 'id',
        },
      },
      serviceId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Services',
          key: 'id',
        },
      },
      isActive: {
        allowNull: false,
        defaultValue: true,
        type: DataTypes.BOOLEAN,
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'ServiceKapster',
    },
  )
  return ServiceKapster
}
