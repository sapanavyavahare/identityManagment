'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Role_Permissions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            role_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    // User belongsTo Company 1:1
                    model: 'roles',
                    key: 'role_id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            permission_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    // User belongsTo Company 1:1
                    model: 'permissions',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Role_Permissions');
    },
};
