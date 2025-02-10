'use strict';

const { Model } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIcrement: true
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Spots",
          key: "id",
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          Model: "Users",
          key: "id",
        }
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isBefore(value) {
            if (startDate >= endDate) {
              throw console.error("startDate must be before endDate");
            }
          }
        },
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.dropTable('Bookings');
  },
};