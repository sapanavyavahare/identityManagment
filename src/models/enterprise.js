'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Enterprise extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Enterprise.hasMany(models.Address, { as: 'address' });
            // Enterprise.hasMany(models.User, { as: 'employes' });
        }
    }
    Enterprise.init(
        {
            name: DataTypes.STRING(100),
            status: DataTypes.STRING,
            enterprise_code: DataTypes.STRING(14),
            enterprise_type: DataTypes.INTEGER,
        },

        {
            sequelize,
            modelName: 'Enterprise',
        }
    );
    return Enterprise;
};
