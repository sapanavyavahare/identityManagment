'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Address extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Address.belongsTo(models.Enterprise, {
                foreignKey: 'enterprise_id',
                as: 'enterprise',
            });
        }
    }
    Address.init(
        {
            enterprise_id: {
                type: DataTypes.INTEGER,
            },
            house_name: DataTypes.STRING,
            street: DataTypes.STRING,
            city: DataTypes.STRING,
            country: DataTypes.STRING,
            post_code: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Address',
        }
    );
    return Address;
};
