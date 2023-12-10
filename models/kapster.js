'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Kapster extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Kapster.hasMany(models.Appointment, {
        as: 'appointment',
        foreignKey: 'kapsterId',
      })
      Kapster.belongsToMany(models.Service, {
        through: 'Service_Kapster',
      })
      Kapster.hasMany(models.ServiceKapster, {
        as: 'service',
        foreignKey: 'kapsterId',
      })
    }
  }
  Kapster.init(
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      gender: {
        allowNull: false,
        type: DataTypes.ENUM('Man', 'Woman'),
      },
      specialization: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Kapster',
    },
  )
  return Kapster
}
