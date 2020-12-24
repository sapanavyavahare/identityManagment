'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('user_roles', 'user_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                // User belongsTo Company 1:1
                model: 'users',
                key: 'id',
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
    },
};
