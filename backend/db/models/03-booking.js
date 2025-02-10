const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.Spot, {
        foreignKey: "spotId",
      });
      Booking.belongsTo(models.User, {
        foreignKey: "userId"
      })
    }
  }

  Booking.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIcrement: true
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Spots",
        key: "id",
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        Model: "Users",
        key: "id",
      }
    },
    startDate: {
      type:DataTypes.DATE,
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
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });

  return Booking;
};
