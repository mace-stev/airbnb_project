const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SpotImage extends Model {
    static associate(models) {
    SpotImage.belongsTo(models.Spot, {
      foreignKey: "spotId",
      onDelete: "CASCADE",
    })
    }
  }
  SpotImage.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    isPreview: {
      type: da.BOOLEAN,
      allowNull:false
    },
  }, {
    sequelize,
    modelName: 'SpotImage',
  });

  return SpotImage;
};