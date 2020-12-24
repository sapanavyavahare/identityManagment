'use strict';
const moment = require('moment');
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            'Permission',
            [
                {
                    name: 'user_add',
                    description: 'Add User',
                    feature: 'User',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                {
                    name: 'user_update',
                    description: 'Update User',
                    feature: 'User',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                {
                    name: 'user_delete',
                    description: 'Delete User',
                    feature: 'User',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                {
                    name: 'user_fetch',
                    description: 'fetch User details',
                    feature: 'User',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                {
                    name: 'role_delete',
                    description: 'Delete role',
                    feature: 'Role',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                {
                    name: 'role_add',
                    description: 'Add role',
                    feature: 'Role',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                {
                    name: 'role_update',
                    description: 'update role',
                    feature: 'Role',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                {
                    name: 'role_fetch',
                    description: 'fetch role details',
                    feature: 'Role',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                {
                    name: 'role_delete',
                    description: 'Delete role',
                    feature: 'Role',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                {
                    name: 'enterprise_delete',
                    description: 'Delete enterprise',
                    feature: 'Enterprise',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                {
                    name: 'enterprise_add',
                    description: 'Add enterprise',
                    feature: 'Enterprise',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                {
                    name: 'enterprise_update',
                    description: 'Update enterprise',
                    feature: 'Enterprise',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                {
                    name: 'enterprise_fetch',
                    description: 'Fetch enterprise details',
                    feature: 'Enterprise',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                {
                    name: 'enterprise_clear',
                    description: 'clear organization data',
                    feature: 'Enterprise',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                {
                    name: 'passwordpolicy_delete',
                    description: 'Delete Password Policy',
                    feature: 'Passwordpolicy',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                {
                    name: 'passwordpolicy_update',
                    description: 'Update Password Policy',
                    feature: 'Passwordpolicy',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                {
                    name: 'passwordpolicy_add',
                    description: 'Add Password Policy',
                    feature: 'Passwordpolicy',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
                {
                    name: 'passwordpolicy_fetch',
                    description: 'fetch Password Policy details',
                    feature: 'Passwordpolicy',
                    status: 'A',
                    createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
