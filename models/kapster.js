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
      Kapster.hasMany(models.ServiceKapster, {
        as: 'services',
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
      photo_url: {
        allowNull: true,
        type: DataTypes.TEXT,
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
