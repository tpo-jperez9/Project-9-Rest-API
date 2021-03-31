// Load modules
const {Model, DataTypes, HasMany} = require('sequelize');
const bcrypt = require('bcryptjs');

// Creates User model
module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'First name cannot be empty'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Last name cannot be empty'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Email name cannot be empty'
        },
        isEmail: {
          msg: 'Email is not valid'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password name cannot be empty'
        },
        len: {
          args: [8,100],
          msg: 'Password must be at least 8 characters long'
        }
      },
      set(val) {
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
      }
    }
  },
  {sequelize});

  // Add associations
  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: false
      }
    });
  }

  return User;
}