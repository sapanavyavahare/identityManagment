'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Weak_Password extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Weak_Password.init({
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Weak_Password',
  });
  return Weak_Password;
};