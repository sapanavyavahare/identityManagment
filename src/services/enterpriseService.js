const { successObject } = require('api-rsp');
const { isPlainObject } = require('lodash');
const _ = require('lodash');
const moment = require('moment');
const { transform } = require('node-json-transform');
//const { Sequelize } = require('sequelize');
const sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const Op = sequelize.Op;

//const { Transaction } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { log } = require('winston');
const logger = require('../config/configure-logger');
const db = require('../models');
//console.log('dbbbb ', db);
const Permission = db.Permission;
const Role = db.Role;
const Enterprise = db.Enterprise;
const User = db.user;

const User_Roles = db.User_Roles;

const { RoleResponse, UserResponse } = require('../response-classes');

class EnterpriseService {
    constructor() {
        this.permissionByFeature = {};
    }
    async getPermissions() {
        const features = await Permission.findAll({
            attributes: ['id', 'name', 'feature', 'description', 'status'],
        });
        var groupData = _.groupBy(features, (f) => {
            return f.feature;
        });

        for (const value of Object.keys(groupData)) {
            var objArray = [];
            for (const obj of groupData[value]) {
                objArray.push({
                    id: obj.id,
                    name: obj.name,
                    description: obj.description,

                    status: obj.status,
                });
                groupData[value] = objArray;
            }
        }

        return groupData;
    }

    async createRoleWithPermission(data) {
        const newRole = await Role.create(
            {
                name: data.name,
                description: data.description,
                status: 'A',
                enterprise_code: data.enterpriseCode,
            },
            {
                include: ['permissions'],
            }
        );
        console.log('new Role ', newRole.get());
        await newRole.setPermissions(data.permissionId);
        return newRole;
    }

    async getRolePermissions() {
        const roles = await Role.findAll({
            attributes: ['role_id', 'name', 'description', 'status'],

            include: [
                {
                    model: Permission,
                    as: 'permissions',
                    attributes: ['id', 'name', 'description', 'status'],
                    through: {
                        attributes: [],
                    },
                },
            ],
        });
        return roles;
    }

    async updateRole(roleId, data) {
        const role = await Role.findByPk(roleId, {
            include: ['permissions'],
        });
        console.log('status ', role.get().status);
        await role.setPermissions(data.permissionId);
        return await Role.update(
            {
                name: data.name,
                description: data.description,
                status: role.get().status,
                enterprise_code: role.get().enterpriseCode,
            },
            {
                where: { role_id: roleId },
            },
            {
                include: ['permissions'],
            }
        );
    }

    async getRoleById(id) {
        const roles = await Role.findByPk(id, {
            attributes: ['role_id', 'name', 'description', 'status'],
            include: [
                {
                    model: Permission,
                    as: 'permissions',
                    attributes: [
                        'id',
                        'name',
                        'description',
                        'status',
                        'feature',
                    ],

                    through: {
                        attributes: [],
                    },
                },
            ],
        });

        console.log('role ', roles);
        const groupData = _.groupBy(roles.get().permissions, (f) => {
            return f.feature;
        });

        for (const value of Object.keys(groupData)) {
            var objArray = [];
            for (const obj of groupData[value]) {
                objArray.push({
                    id: obj.id,
                    name: obj.name,
                    description: obj.description,

                    status: obj.status,
                });
                groupData[value] = objArray;
            }
        }
        const roleResponse = new RoleResponse(
            roles.get().role_id,
            roles.get().name,
            roles.get().description,
            roles.get().status,
            groupData
        );

        return roleResponse;
    }
    async getPermissionByFeature(featureArray) {
        const permissions = await Permission.findAll({
            attributes: ['id', 'name', 'description', 'status', 'feature'],
            where: {
                feature: [featureArray],
            },
        });

        if (permissions === null) {
            throw new Error('invalid feature value');
        }
        var groupData = _.groupBy(permissions, (f) => {
            return f.feature;
        });

        for (const value of Object.keys(groupData)) {
            var objArray = [];
            for (const obj of groupData[value]) {
                objArray.push({
                    id: obj.id,
                    name: obj.name,
                    description: obj.description,

                    status: obj.status,
                });
                groupData[value] = objArray;
            }
        }
        return groupData;
    }

    async deleteRole(roleId) {
        return await Role.destroy({
            where: {
                role_id: roleId,
            },
            cascade: true,
            include: ['permissions'],
        });
    }

    async getUsers() {
        var roleNames = [];
        var permissionNames = [];
        var userArray = [];
        var roleArray;
        const users = await User.findAll({
            attributes: [
                'id',
                'username',
                'name',
                'email_id',
                'enterprise_code',
                'status',
                'user_type',
            ],
            where: {
                enterprise_code: '79622596-fc6a-4048-b0b6-ae40388fef8f',
            },
            include: {
                model: Role,
                as: 'Roles',
                attributes: ['role_id', 'name', 'status'],
                through: {
                    attributes: [],
                },
                include: {
                    model: Permission,
                    as: 'permissions',
                    attributes: ['name'],
                    through: {
                        attributes: [],
                    },
                },
            },
        });
        for (const user of users) {
            roleNames = _.map(user.Roles, 'name');
            for (const iterator of user.Roles) {
                permissionNames = _.map(iterator.permissions, 'name');
            }
            roleArray = user.Roles.map(function (obj) {
                return {
                    id: obj.role_id,
                    name: obj.name,
                    status: obj.status,
                };
            });

            var userResponse = await new UserResponse(
                user.id,
                user.username,
                user.name,
                user.email_id,
                user.enterprise_code,
                user.status,
                user.user_type,
                roleNames,
                permissionNames,
                roleArray
            );
            userArray.push(userResponse);
        }
        return userArray;
    }

    async createRootEnterprise(data) {
        const result = await db.sequelize
            .transaction(async (t) => {
                const enterprise = await Enterprise.create(
                    {
                        name: data.name,
                        status: 'Active',
                        enterprise_code: uuidv4(),
                        enterprise_type: 1,
                        createdAt: moment(new Date()).format(
                            'YYYY-MM-DD HH:mm'
                        ),
                        updatedAt: moment(new Date()).format(
                            'YYYY-MM-DD HH:mm'
                        ),
                    },
                    { transaction: t }
                );
                console.log(
                    'enterprise code ',
                    enterprise.get().enterprise_code
                );
                const permissionId = await Permission.findAll({
                    attributes: ['id'],
                });
                console.log('permissionId ', permissionId);
                const role = await this.createRoleWithPermission(
                    {
                        name: 'Admin',
                        description: 'Admin of enterprise',
                        status: 'A',
                        enterpriseCode: enterprise.get().enterprise_code,
                        permissionId: permissionId,
                    },
                    { transaction: t }
                );
                console.log('role created ', role);

                const newUser = await this.createUserWithRoles(
                    {
                        username: data.admin.username,
                        emailId: data.admin.emailId,
                        enterpriseCode: enterprise.get().enterprise_code,
                        name: data.admin.name,
                        roles: 'Admin',
                    },
                    { transaction: t }
                );
                console.log('new user ', newUser);
                return enterprise.get().enterprise_code;
            })
            .then((r) => {
                console.log('result ', r);
                return r;
            })
            .catch((err) => {
                console.log('err ', err);
            });
        return result;
    }

    async createUserWithRoles(data) {
        const newUser = await User.create(
            {
                username: data.username,
                email_id: data.emailId,
                enterprise_code: data.enterpriseCode,
                user_type: 1,
                name: data.name,
            },
            {
                include: ['Roles'],
            }
        );
        console.log('new user ', newUser);
        const roleId = await Role.findAll({
            where: {
                [Op.and]: {
                    name: data.roles,
                    enterprise_code: data.enterpriseCode,
                },
            },
        });
        const result = await newUser.setRoles(roleId);
    }

    async deleteUser(userId) {
        const result = await User.update(
            {
                status: 'D',
            },
            {
                where: {
                    id: userId,
                },
            }
        );
        return result;
    }

    async suspendUser(userId) {
        const result = await User.update(
            {
                status: 'S',
            },
            {
                where: {
                    id: userId,
                },
            }
        );
        return result;
    }
    async activateUser(userId) {
        const result = await User.update(
            {
                status: 'A',
            },
            {
                where: {
                    id: userId,
                },
            }
        );
        return result;
    }
    async getEnterpriseDetails() {
        var roleNames = [];
        var permissionNames = [];
        const enterprise = await Enterprise.findOne({
            where: {
                enterprise_code: '4d00130a-6c8d-4b21-9f07-98b1ea37f855',
            },
        });
        console.log('enterprise ', enterprise);
        const user = await User.findOne({
            attributes: [
                'id',
                'username',
                'name',
                'email_id',
                'enterprise_code',
                'status',
                'user_type',
            ],
            where: {
                enterprise_code: '4d00130a-6c8d-4b21-9f07-98b1ea37f855',
            },
            include: {
                model: Role,
                as: 'Roles',
                attributes: ['name'],
                where: {
                    name: 'Admin',
                },
                through: {
                    attributes: [],
                },
                include: {
                    model: Permission,
                    as: 'permissions',
                    attributes: ['name'],
                    through: {
                        attributes: [],
                    },
                },
            },
        });
        // console.log('user ', user);
        roleNames = _.map(user.Roles, 'name');
        for (const iterator of user.Roles) {
            permissionNames = _.map(iterator.permissions, 'name');
        }
        var admin = {
            id: user.id,
            username: user.username,
            name: user.name,
            emailId: user.email_id,
            enterpriseCode: user.enterprise_code,
            status: user.status,
            roleNames: roleNames,
            permissionNames: permissionNames,
            userType: user.user_type,
        };
        console.log('name ', enterprise.get().name);
        var enterpriseDetails = {
            name: enterprise.get().name,
            status: enterprise.get().status,
            enterpriseCode: enterprise.get().enterprise_code,
            admin: admin,
            createDate: enterprise.get().createdAt,
            lastUpdatedDate: enterprise.get().updatedAt,
            defaultRoles: null,
            enterpriseType: enterprise.get().enterprise_type,
        };
        console.log('enterprise details ', enterpriseDetails);
        return enterpriseDetails;
    }
    async suspendEnterprise(enterpriseId) {
        const result = await Enterprise.update(
            {
                status: 'suspend',
            },
            {
                where: {
                    id: enterpriseId,
                },
            }
        );
        return result;
    }

    async activateEnterprise(enterpriseId) {
        const result = await Enterprise.update(
            {
                status: 'active',
            },
            {
                where: {
                    id: enterpriseId,
                },
            }
        );
        return result;
    }
    async deleteEnterprise(enterpriseId) {
        const result = await Enterprise.update(
            {
                status: 'deactivate',
            },
            {
                where: {
                    id: enterpriseId,
                },
            }
        );
        return result;
    }
}
module.exports = EnterpriseService;
