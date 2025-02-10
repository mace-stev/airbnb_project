'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews', [
      {
        spotId: 1, //"App Academy"
        userId: 1, 
        review: 'Amazing place to learn!',
        rating: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,// "Hotel California",
        userId: 2, 
        review: 'Had a wonderful stay!',
        rating: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3, //"Studio"
        userId: 1, // Assuming a user with ID 1
        review: 'Cozy and comfortable!',
        rating: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};
   