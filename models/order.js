/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.ServiceKapster.hasOne(models.Order, {
        foreignKey: 'kapsterServiceId',
      })

      models.User.hasOne(models.Order, {
        foreignKey: 'userId',
      })

      models.Order.belongsTo(models.ServiceKapster, {
        foreignKey: 'kapsterServiceId',
      })

      models.Order.hasOne(models.Appointment, {
        foreignKey: 'orderId',
      })
    }
  }
  Order.init(
    {
      kapsterServiceId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'ServiceKapsters',
          key: 'id',
        },
      },
      userId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      gross_amount: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      token: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      redirect_url: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      booking_time: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      transaction_id: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      transaction_status: {
        allowNull: true,
        type: DataTypes.ENUM(
          'pending',
          'settlement',
          'cancel',
          'deny',
          'expire',
          'refund',
          'partial_refund',
          'authorize',
          'capture',
          'chargeback',
          'failure',
        ),
      },
      expiry_time: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      transaction_time: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      payment_type: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      payment_code: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      currency: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      signature_key: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      fraud_status: {
        allowNull: true,
        type: DataTypes.ENUM('accept', 'deny'),
      },
      merchant_id: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      store: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      refund_key: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      refund_reason: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      refund_amount: {
        allowNull: true,
        type: DataTypes.FLOAT,
      },
    },
    {
      sequelize,
      modelName: 'Order',
    },
  )
  return Order
}
