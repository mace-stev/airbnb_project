'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReviewImages', {
      id: {
        type: Sequelize.INTEGER,
        allownull: false
      },
      reviewId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "Reviews",  
            schema: options.schema  
          },
          key: "id"
        },
        onDelete: 'CASCADE',
      },
      url: {
        type: Sequelize.STRING,
        allownull: false,
        
     },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.dropTable('ReviewImages');
  },
};