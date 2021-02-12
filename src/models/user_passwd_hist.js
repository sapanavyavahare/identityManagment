'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User_Passwd_Hist extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User_Passwd_Hist.belongsTo(models.user, {
                foreignKey: 'user_id',
                as: 'users',
            });
        }
    }
    User_Passwd_Hist.init(
        {
            user_id: DataTypes.INTEGER,
            password: DataTypes.STRING,
            salt: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'User_Passwd_Hist',
        }
    );
    return User_Passwd_Hist;
};
