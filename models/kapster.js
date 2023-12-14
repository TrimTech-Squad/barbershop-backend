/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
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
      Kapster.hasMany(models.ServiceKapster, {
        as: 'service',
        foreignKey: 'kapsterId',
        sourceKey: 'id',
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
      status: {
        allowNull: false,
        defaultValue: 'Available',
        type: DataTypes.ENUM('Available', 'Not Available', 'Resigned'),
      },
    },
    {
      sequelize,
      modelName: 'Kapster',
    },
  )
  return Kapster
}
