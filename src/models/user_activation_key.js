'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User_Activation_Key extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User_Activation_Key.belongsTo(models.user, {
                foreignKey: 'user_id',
                as: 'users',
            });
        }
    }
    User_Activation_Key.init(
        {
            user_id: DataTypes.INTEGER,
            activation_key: DataTypes.STRING,
            expiry_date: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'User_Activation_Key',
        }
    );
    return User_Activation_Key;
};
