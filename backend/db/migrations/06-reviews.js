'use strict';

const { Model } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allownull: false,
        autoIncrement: true 
      },
      userId: {
        type: Sequelize.INTEGER,
        allownull: false,
        references: {
          Model: "Users",
          Key: "id"
        }
      },
      spotId: {
        type: Sequelize.INTEGER,
        references: {
          Model: "Spots",
          Key: "id"
        }
      },
      content: {
        type: Sequelize.TEXT,
        allownull: false,
        validate: {
          notEmpty: true,
          len:[100, 100]
        }
      },
      rating: {
        type: Sequelize.INTEGER,
        allownull: false,
        validate: {
          isInt: true,
          min: 1,
          max: 5,
        }
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
    options.tableName = 'Reviews';
    await queryInterface.dropTable('Reviews');
  },
};