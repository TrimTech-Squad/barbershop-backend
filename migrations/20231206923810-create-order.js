/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      kapsterServiceId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'ServiceKapsters',
          key: 'id',
        },
      },
      userId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      gross_amount: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      token: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      redirect_url: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      booking_time: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      transaction_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      transaction_status: {
        allowNull: true,
        type: Sequelize.ENUM(
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
        type: Sequelize.DATE,
      },
      transaction_time: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      payment_type: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      payment_code: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      currency: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      signature_key: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      fraud_status: {
        allowNull: true,
        type: Sequelize.ENUM('accept', 'deny'),
      },
      merchant_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      store: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      refund_key: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      refund_reason: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      refund_amount: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders')
  },
}
