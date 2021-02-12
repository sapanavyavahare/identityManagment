const { successObject } = require('api-rsp');
const _ = require('lodash');
const moment = require('moment');
const config = require('../config/auth.config');

//const { Sequelize } = require('sequelize');
const sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const Op = sequelize.Op;

//const { Transaction } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const db = require('../models');
const Permission = db.Permission;
const Role = db.Role;
const Enterprise = db.Enterprise;
const User = db.user;
const Password_Policy = db.Password_Policy;
const Password_Policy_Attr = db.Password_Policy_Attr;
const User_Activation_Key = db.User_Activation_Key;
const User_Passwd_Hist = db.User_Passwd_Hist;

const { RoleResponse, UserResponse } = require('../response-classes');
const { AuthService } = require('../middlewares');
const { result } = require('lodash');
const user = require('../models/user');
const authService = new AuthService();

const jwt = require('jsonwebtoken');

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

    async createRoleWithPermission(data, enterpriseCode) {
        const newRole = await Role.create(
            {
                name: data.name,
                description: data.description,
                status: 'A',
                enterprise_code: enterpriseCode,
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
        return await Role.update(
            {
                status: 'D',
            },
            {
                where: {
                    role_id: roleId,
                },
            }
        );
    }
    async supportMethodForGetUser(user) {
        var roleNames = [];
        var permissionNames = [];
        var permissionArray = [];
        var roleArray = [];
        roleNames = _.map(user.Roles, 'name');
        for (const iterator of user.Roles) {
            permissionNames = _.map(iterator.permissions, 'name');

            permissionArray = _.union(permissionArray, permissionNames);
        }
        roleArray = user.Roles.map(function (obj) {
            return {
                id: obj.role_id,
                name: obj.name,
                status: obj.status,
            };
        });
        const userResponse = await new UserResponse(
            user.id,
            user.username,
            user.name,
            user.email_id,
            user.enterprise_code,
            user.status,
            user.user_type,
            roleNames,
            permissionArray,
            roleArray
        );
        return userResponse;
    }
    async getUsers(enterpriseCode) {
        var userArray = [];
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
                enterprise_code: enterpriseCode,
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
            const userResponse = await this.supportMethodForGetUser(user);
            userArray.push(userResponse);
        }
        console.log('user array ', userArray);
        return userArray;
    }

    async getLoggedInUserDetails(userId) {
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
                id: userId,
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
        const userResponse = await this.supportMethodForGetUser(user);
        return userResponse;
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
                        permissionId: permissionId,
                    },
                    enterprise.get().enterprise_code,
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
                    enterprise.get().enterprise_code,
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

    async createUserWithRoles(data, enterpriseCode) {
        console.log(
            'enterprise code in create user with roles ',
            enterpriseCode
        );
        const result = await db.sequelize
            .transaction(async (t) => {
                const newUser = await User.create(
                    {
                        username: data.username,
                        email_id: data.emailId,
                        enterprise_code: enterpriseCode,
                        user_type: 1,
                        name: data.name,
                    },
                    {
                        include: ['Roles'],
                    },
                    {
                        transaction: t,
                    }
                );
                console.log('new user ', newUser);
                const roleId = await Role.findAll(
                    {
                        where: {
                            [Op.and]: {
                                name: data.roles,
                                enterprise_code: enterpriseCode,
                            },
                        },
                    },
                    { transaction: t }
                );
                await newUser.setRoles(roleId);

                var activationKey = await authService.getRandomString(20);
                console.log('activation key ', activationKey);
                var expiryDate = Date.now() + 120 * 3600 * 1000;
                console.log('expiry date ', expiryDate);
                const userActivationKey = await User_Activation_Key.create(
                    {
                        user_id: newUser.get().id,
                        activation_key: activationKey,
                        expiry_date: expiryDate,
                    },
                    { transaction: t }
                );
                return userActivationKey;
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
    async getEnterpriseDetails(enterpriseCode) {
        var roleNames = [];
        var permissionNames = [];
        const enterprise = await Enterprise.findOne({
            where: {
                enterprise_code: enterpriseCode,
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
                enterprise_code: enterpriseCode,
            },
            include: {
                model: Role,
                as: 'Roles',
                attributes: ['name'],

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
        console.log('delete enterprise result ', result);
        return result;
    }
    async createPasswordPolicy(data, enterpriseCode) {
        var attributeArray = [];
        var keys = Object.keys(data);
        for (var i = 3; i < keys.length; i++) {
            console.log('iterator ', keys[i]);
            console.log('iterator value ', data[`${keys[i]}`]);
            attributeArray.push({
                attr_name: keys[i],
                attr_value: data[`${keys[i]}`],
            });
        }
        const policy = await Password_Policy.create(
            {
                enterprise_code: enterpriseCode,
                policy_name: data.policyName,
                description: data.description,
                status: 'Active',
                attributes: attributeArray,
            },
            {
                include: ['attributes'],
            }
        );
        console.log('attributes ', policy);
        return policy;
    }
    async fetchPasswordPolicies() {
        var policyArray = [];

        const result = await Password_Policy.findAll({
            attributes: ['id', 'policy_name', 'description', 'status'],
            include: [
                {
                    model: Password_Policy_Attr,
                    as: 'attributes',
                    attributes: ['attr_name', 'attr_value'],
                },
            ],
        });
        console.log('result ', result);
        for (const iterator of result) {
            var policies;
            console.log('iterator ', iterator.id);

            policies = {
                policyId: iterator.id,
                policyName: iterator.policy_name,
                description: iterator.description,
            };
            for (const attribute of iterator.attributes) {
                console.log('attrubute name ', attribute.attr_name);
                policies[`${attribute.attr_name}`] = isNaN(attribute.attr_value)
                    ? attribute.attr_value
                    : parseInt(attribute.attr_value);
            }
            policies['status'] = iterator.status;
            policyArray.push(policies);
        }

        console.log('policies ', policies);
        return policyArray;
    }

    async updatePasswordPolicy(data, enterpriseCode) {
        var attributeArray = [];
        var keys = Object.keys(data);
        var policyId;
        const policy = await Password_Policy.findOne({
            where: {
                policy_name: data.policyName,
            },
            include: ['attributes'],
        });
        if (!policy) {
            throw new Error(404, 'Bad request , result not found');
        }
        policyId = policy.get().id;
        for (var i = 3; i < keys.length; i++) {
            console.log('iterator ', keys[i]);
            console.log('iterator value ', data[`${keys[i]}`]);
            attributeArray.push({
                policy_id: policyId,
                attr_name: keys[i],
                attr_value: data[`${keys[i]}`],
            });
        }
        await Password_Policy_Attr.destroy({
            where: {
                policy_id: policyId,
            },
        });

        await Password_Policy_Attr.bulkCreate(attributeArray);
        const passwordPolicy = await Password_Policy.update(
            {
                enterprise_code: enterpriseCode,
                policy_name: data.policyName,
                description: data.description,
                status: 'Active',
                attributes: attributeArray,
            },
            {
                where: {
                    policy_name: data.policyName,
                },
            }
        );
        return passwordPolicy;
    }

    async activatePasswordPolicy(policyId) {
        const result = await Password_Policy.update(
            {
                status: 'active',
            },
            {
                where: {
                    id: policyId,
                },
            }
        );
        return result;
    }

    async deactivatePasswordPolicy(policyId) {
        const result = await Password_Policy.update(
            {
                status: 'deactive',
            },
            {
                where: {
                    id: policyId,
                },
            }
        );
        return result;
    }

    async deletePasswordPolicy(policyId) {
        const result = await Password_Policy.update(
            {
                status: 'suspend',
            },
            {
                where: {
                    id: policyId,
                },
            }
        );
        return result;
    }

    async activateUserByToken(activationKey, data) {
        const result = await db.sequelize
            .transaction(async (t) => {
                const user = await User_Activation_Key.findOne({
                    where: {
                        activation_key: activationKey,
                        expiry_date: {
                            [Op.gt]: Date.now(),
                        },
                    },
                    include: ['users'],
                });
                console.log('user ', user.users);
                if (!user) {
                    return {
                        title: 'fail to activate ',
                        message:
                            'Your activation link is invalid. Please register again',
                    };
                }
                if (data.newPassword === data.confirmPassword) {
                    const passwordData = await authService.saltHashPassword(
                        data.newPassword
                    );
                    console.log('password data ', passwordData);
                    await User.update(
                        {
                            password: passwordData.passwordHash,
                            salt: passwordData.salt,
                        },
                        {
                            where: {
                                id: user.users.id,
                            },
                        },
                        {
                            transaction: t,
                        }
                    );

                    await User_Passwd_Hist.create(
                        {
                            user_id: user.users.id,
                            password: passwordData.passwordHash,
                            salt: passwordData.salt,
                        },
                        { transaction: t }
                    );
                }
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
    async getSalt(userName) {
        console.log('username ', userName);
        var newSalt;
        const salt = await User.findOne({
            attributes: ['salt'],
            where: {
                username: userName,
            },
        });

        if (salt.length === 0) {
            newSalt = await authService.getRandomString(16);
            await User.update(
                {
                    salt: newSalt,
                },
                {
                    where: {
                        username: userName,
                    },
                }
            );
            return newSalt;
        } else {
            console.log('not valid');
            return JSON.stringify(salt);
        }
    }

    async changePassword(data) {
        const salt = await this.getSalt(data.username);
        console.log('salt ', salt);
        console.log('data password ', data.password);
        const passwordData = await authService.sha512(data.password, salt);
        const userPassword = await User.findOne({
            attributes: ['id', 'password', 'salt'],
            where: {
                username: data.username,
            },
        });
        console.log('old password ', userPassword.password);
        console.log('new password ', passwordData.passwordHash);
        console.log('user salt ', userPassword.salt);
        console.log('password data salt ', passwordData.salt);
        if (passwordData.passwordHash === userPassword.password) {
            const passwordData = await authService.sha512(
                data.newPassword,
                salt
            );
            await User.update(
                {
                    password: passwordData.passwordHash,
                },
                {
                    where: {
                        username: data.username,
                    },
                }
            );
            await User_Passwd_Hist.create({
                user_id: userPassword.id,
                password: passwordData.passwordHash,
                salt: salt,
            });
        } else {
            throw new Error('not valid password');
        }
    }

    async forgotPassword(username) {
        const activationKey = await authService.getRandomString(20);
        const userId = await User.findOne({
            attributes: ['id'],
            where: {
                username: username,
            },
        });
        console.log('userId ', userId.id);
        const user = await User_Activation_Key.update(
            {
                activation_key: activationKey,
                expiry_date: Date.now() + 120 * 3600 * 1000,
            },
            {
                where: {
                    user_id: userId.id,
                },
            }
        );
        console.log('user ', user);
        return user;
    }

    async authenticateUser(data) {
        var token;

        const user = await User.findOne({
            attributes: [
                'id',
                'username',
                'enterprise_code',
                'salt',
                'password',
                'user_type',
                'updatedAt',
            ],
            where: {
                username: data.username,
            },
            include: {
                model: User_Activation_Key,
                as: 'userActivationKey',
                attributes: ['expiry_date'],
            },
        });
        console.log('user ', user);
        if (!user) {
            throw Error('user not found!');
        }
        const passwordData = await authService.sha512(data.password, user.salt);
        if (passwordData.passwordHash === user.password) {
            token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400,
            });

            config.accessTokens.push(token);
            console.log('config access token in service ', config.accessTokens);
        }
        console.log('token ', token);
        const result = {
            token: token,
            enterpriseCode: user.enterprise_code,
            userType: user.user_type,
            lastLoginDate: user.updatedAt,
            expiration: user.userActivationKey[0].expiry_date,
        };
        console.log('result ', result);
        return result;
    }
}
module.exports = EnterpriseService;
