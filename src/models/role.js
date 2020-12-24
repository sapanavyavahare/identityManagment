'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Role.belongsToMany(models.Permission, {
                through: 'Role_Permissions',
                foreignKey: 'role_id',
                as: 'permissions',
                onDelete: 'CASCADE',
            });
            Role.belongsToMany(models.user, {
                through: 'User_Roles',
                foreignKey: 'role_id',
            });
        }
    }
    Role.init(
        {
            role_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: DataTypes.STRING(50),

            description: DataTypes.STRING,
            status: DataTypes.STRING,
            enterprise_code: DataTypes.STRING(14),
        },

        {
            sequelize,
            modelName: 'Role',
        }
    );
    return Role;
};
