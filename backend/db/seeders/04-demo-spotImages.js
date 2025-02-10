'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1, // Referring to "App Academy"
        url: 'https://example.com/images/app_academy.jpg',
        isPreview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2, // Referring to "Hotel California"
        url: 'https://example.com/images/hotel_california.jpg',
        isPreview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3, // Referring to "Studio"
        url: 'https://example.com/images/studio.jpg',
        isPreview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SpotImages', null, {});
  }
};
  