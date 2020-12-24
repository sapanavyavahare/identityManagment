'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            user.belongsToMany(models.Role, {
                through: 'User_Roles',
                foreignKey: 'user_id',
                as: 'Roles',
            });
        }
    }
    user.init(
        {
            username: DataTypes.STRING,
            email_id: DataTypes.STRING,
            password: DataTypes.STRING,
            salt: DataTypes.STRING,
            passwd_created: DataTypes.DATE,
            login_fail_count: DataTypes.INTEGER,
            enterprise_code: DataTypes.STRING,
            status: DataTypes.STRING,
            user_type: DataTypes.INTEGER,
            password_expiry: DataTypes.DATE,
            name: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'user',
        }
    );
    return user;
};
