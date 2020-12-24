'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            username: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            email_id: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            salt: {
                type: Sequelize.STRING,
            },
            passwd_created: {
                type: Sequelize.DATE,
            },
            login_fail_count: {
                type: Sequelize.INTEGER,
            },
            enterprise_code: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.STRING,
            },
            user_type: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            password_expiry: {
                type: Sequelize.DATE,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('users');
    },
};
