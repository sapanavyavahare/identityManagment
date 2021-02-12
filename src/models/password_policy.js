'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Password_Policy extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Password_Policy.hasMany(models.Password_Policy_Attr, {
                foreignKey: 'policy_id',
                as: 'attributes',
            });
        }
    }
    Password_Policy.init(
        {
            enterprise_code: DataTypes.STRING,
            policy_name: DataTypes.STRING,
            description: DataTypes.STRING,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Password_Policy',
        }
    );
    return Password_Policy;
};
