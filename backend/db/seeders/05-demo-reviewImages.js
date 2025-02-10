'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ReviewImages', [
      //seeder details here
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ReviewImages', null, {});
  }
};