'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Permission extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Permission.belongsToMany(models.Role, {
                through: 'Role_Permissions',
                foreignKey: 'permission_id',
                as: 'roles',
            });
        }
    }
    Permission.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: DataTypes.STRING(50),
            description: DataTypes.STRING,
            feature: DataTypes.STRING(50),
            status: DataTypes.STRING(1),
        },
        {
            sequelize,
            modelName: 'Permission',
        }
    );
    return Permission;
};
