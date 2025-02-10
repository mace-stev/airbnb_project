'use strict';

const { Model } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SpotImages', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          Model: "Spots",
          key: "id",
          onDelete: "CASCADE"
        }

      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
          notEmpty: true
        }
      },
    isPreview: {
      type: Sequelize.BOOLEAN,
      allowNull:false
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
    options.tableName = 'SpotImages';
    await queryInterface.dropTable('SpotImages');
  },
};