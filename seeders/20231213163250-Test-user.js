/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict'
const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     *
     */

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'John Doe',
          email: 'admin@mail.com',
          password: await bcrypt.hash('12345678', 10),
          role: 'Admin',
          number: '08123456789',
          photo_url: 'https://www.google.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
}
