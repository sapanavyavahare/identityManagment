const { successObject } = require('api-rsp');
const _ = require('lodash');
const moment = require('moment');
const { transform } = require('node-json-transform');
//const { Sequelize } = require('sequelize');
const sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const Op = sequelize.Op;

//const { Transaction } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const db = require('../models');
//console.log('dbbbb ', db);
const Permission = db.Permission;
const Role = db.Role;
const Role_Permissions = db.Role_Permissions;
const Enterprise = db.Enterprise;
const User = db.user;

const User_Roles = db.User_Roles;

const { RoleResponse } = require('../response-classes');

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
                desription: data.discription,
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

    async createUserWithRoles(data) {
        return await User.create(
            {
                username: data.username,
                email_id: data.email_id,
                enterprise_code: data.enterprise_code,
                user_type: 1,
                name: data.name,
                createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm'),
            },
            {
                include: ['Roles'],
            }
        ).then(async (newUser) => {
            console.log('new user ', newUser);
            return await newUser
                .setRoles(data.role_id)
                .then((joinTableData) => {
                    console.log('role new ', newUser);
                    // console.log('joined table data ', joinTableData);
                    return newUser;
                });
        });
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

    // async getRoleById(id) {
    //     return await Role.findByPk(id, {
    //         include: ['permissions'],
    //     }).then(async (roles) => {
    //         var idArray = [];
    //         console.log('role ', JSON.stringify(roles));
    //         for (const element of roles.get().permissions) {
    //             idArray.push(element.id);
    //         }
    //         for (const element of roles.get().permissions) {
    //             const permissions = await Permission.findAll({
    //                 attributes: ['id', 'name', 'description', 'status'],
    //                 where: {
    //                     [Op.and]: {
    //                         id: idArray,
    //                         feature: element.feature,
    //                     },
    //                 },
    //             });
    //             this.permissionByFeature[`${element.feature}`] = permissions;
    //         }
    //         const roleResponse = new RoleResponse(
    //             roles.get().role_id,
    //             roles.get().name,
    //             roles.get().description,
    //             roles.get().status,
    //             this.permissionByFeature
    //         );

    //         return roleResponse;
    //     });
    // }
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
        if (roles == null) {
            throw new Error('record with given  id not found ');
        }
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

    async createRootEnterprise(data) {
        const result = await db.sequelize
            .transaction(async (t) => {
                return await Enterprise.create(
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
                ).then(async (enterprise) => {
                    console.log(
                        'enterprise code ',
                        enterprise.get().enterprise_code
                    );
                    return await this.createRoleWithPermission(
                        {
                            name: 'Admin',
                            description: 'Admin of enterprise',
                            status: 'A',
                            enterprise_code: enterprise.get().enterprise_code,
                            permission_id: [
                                1,
                                2,
                                3,
                                4,
                                5,
                                6,
                                7,
                                8,
                                9,
                                10,
                                11,
                                12,
                                13,
                                14,
                                15,
                                16,
                                17,
                                18,
                            ],
                        },
                        { transaction: t }
                    ).then(async (role) => {
                        console.log('role created ', role);

                        return await this.createUserWithRoles(
                            {
                                username: data.admin.username,
                                email_id: data.admin.email_id,
                                enterprise_code: enterprise.get()
                                    .enterprise_code,
                                name: data.admin.name,
                                role_id: role.get().role_id,
                            },
                            { transaction: t }
                        ).then((newUser) => {
                            console.log('new user ', newUser);
                            return enterprise.get().enterprise_code;
                        });
                    });
                });
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
}
module.exports = EnterpriseService;
