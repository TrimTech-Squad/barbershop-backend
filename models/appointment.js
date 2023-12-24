// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    // Mendefinisikan hubungan antara Appointment dengan User dan ServiceKapster
    static associate(models) {
      // Menghubungkan Appointment dengan User
      Appointment.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
      })

      //Menghubungkan Appointment dengan ServiceKapster
      Appointment.belongsTo(models.ServiceKapster, {
        as: 'kapster',
        foreignKey: 'kapsterServiceId',
      })
    }
  }
  Appointment.init(
    {
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      kapsterServiceId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'ServiceKapsters',
          key: 'id',
        },
      },
      orderId: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {
          model: 'Orders',
          key: 'id',
        },
      },
      date: {
        type: DataTypes.DATE,
        validate: {
          isDate: true,
        },
      },
      time: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.ENUM('Booked', 'Completed', 'Cancelled'),
        defaultValue: 'Booked',
      },
    },
    {
      sequelize,
      modelName: 'Appointment',
    },
  )
  return Appointment
}
