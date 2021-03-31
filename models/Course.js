// Load modules
const {Model, DataTypes} = require('sequelize');

// Creates Course model
module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Title cannot be empty'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Title cannot be empty'
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
    }
  },
  {sequelize});

  // Add associations
  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: false
      }
    });
  }

  return Course;
}