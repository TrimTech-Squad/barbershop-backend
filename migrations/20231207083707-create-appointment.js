'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Appointments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      kapsterServiceId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'ServiceKapsters',
          key: 'id',
        },
      },
      orderId: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'Orders',
          key: 'id',
        },
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      time: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('Booked', 'Completed', 'Cancelled'),
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Appointments')
  },
}
