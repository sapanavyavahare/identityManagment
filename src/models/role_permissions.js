'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Role_Permissions extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Role_Permissions.belongsTo(models.Role, { foreignKey: 'role_id' });
            Role_Permissions.belongsTo(models.Permission, {
                foreignKey: 'permission_id',
            });
        }
    }
    Role_Permissions.init(
        {
            role_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'role',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            permission_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'permission',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'Role_Permissions',
        }
    );
    return Role_Permissions;
};
