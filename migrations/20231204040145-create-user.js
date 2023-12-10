/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          min: 8,
        },
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      number: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      photo_url: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      role: {
        allowNull: false,
        type: Sequelize.ENUM('Customer', 'Admin'),
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
    await queryInterface.dropTable('Users')
  },
}
