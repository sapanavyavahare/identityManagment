const { sendSuccessRsp, sendErrorRsp, successObject } = require('api-rsp');
const { EnterpriseService } = require('../services');
const enterpriseService = new EnterpriseService();

const logger = require('../config/configure-logger');

class EnterpriseController {
    async getPermissions(req, res) {
        try {
            console.log('in conn', req.user);
            const result = await enterpriseService.getPermissions();
            logger.infoLog.info('get all permissions', { result });
            res.send(result);
        } catch (err) {
            logger.errorLog.error('err in getPermission ', err);
            return res
                .status(500)
                .send({ message: 'internal server error', error: err });
        }
    }

    async createRolePermission(req, res) {
        try {
            console.log('in conn', req.user.enterprise_code);

            await enterpriseService.createRoleWithPermission(
                req.body,
                req.user.enterprise_code
            );
            logger.infoLog.info('Role created successfully.');
            res.send({
                code: 201,
                message: 'Role created successfully.',
                applicationErrorCode: 0,
            });
        } catch (err) {
            logger.errorLog.error('Error in create role permission :: ', err);
            return sendErrorRsp(res, {
                code: 'CREATE_ROLE_WITH_PERMISSIONS_FAILED',
                message: 'Unable to create role failed',
                httpCode: 500,
            });
        }
    }

    async getRolePermissions(req, res) {
        try {
            const result = await enterpriseService.getRolePermissions();
            logger.infoLog.info('get role permissions ', { result });
            res.send({ roles: result });
        } catch (err) {
            logger.errorLog.error('Error in get role permission :: ', err);
            return sendErrorRsp(res, {
                code: 'GET_Role_FAILED',
                message: 'Unable to get role failed',
                httpCode: 500,
            });
        }
    }

    async updateRole(req, res) {
        try {
            console.log('in conn getrole', req.body.role_id);
            const result = await enterpriseService.updateRole(
                req.params.id,
                req.body
            );
            logger.infoLog.info(result);
            res.send({
                code: 201,
                message: 'Role updated successfully.',
                applicationErrorCode: 0,
            });
        } catch (err) {
            logger.errorLog.error('Error in update role :: ', err);
            return sendErrorRsp(res, {
                code: 'GET_PERMISSIONS_FAILED',
                message: 'Unable to get permission failed',
                httpCode: 500,
            });
        }
    }

    async getRoleById(req, res) {
        try {
            console.log('in conn getrole', req.params.id);

            const result = await enterpriseService.getRoleById(req.params.id);
            logger.infoLog.info('get role by id ', { result });
            res.status(200).send(result);
        } catch (err) {
            logger.errorLog.error('Error in get role by id  :: ', err);
            return sendErrorRsp(res, {
                code: 'GET_Role_FAILED',
                message: 'Unable to get role failed',
                httpCode: 404,
            });
        }
    }
    async getPermissionsByFeature(req, res) {
        try {
            console.log('features ', req.query.feature);
            var feature = req.query.feature;
            var fetaureArray = feature.split(',');
            console.log('feature array ', fetaureArray);
            const result = await enterpriseService.getPermissionByFeature(
                fetaureArray
            );
            logger.infoLog.info('get permission by feature ', { result });
            res.send(result);
        } catch (err) {
            logger.errorLog.error(
                'Error in get permission by feature  :: ',
                err
            );
            return sendErrorRsp(res, {
                code: 'GET_PERMISSIONS_FAILED',
                message: 'Unable to get permission failed',
                httpCode: 404,
            });
        }
    }
    async deleteRole(req, res) {
        try {
            console.log('in conn getrole', req.params.id);
            await enterpriseService.deleteRole(req.params.id);
            logger.infoLog.info('Role deleted successfully.');
            res.send({
                code: 200,
                message: 'Role deleted successfully.',
                applicationErrorCode: 0,
            });
        } catch (err) {
            logger.errorLog.error('Error in delete role   :: ', err);
            return sendErrorRsp(res, {
                code: 'DELETE_ROLE_FAILED',
                message: 'Unable to delete role failed',
                httpCode: 500,
            });
        }
    }

    async createRootEnterprise(req, res) {
        try {
            console.log('in conn getrole', req.body);
            const result = await enterpriseService.createRootEnterprise(
                req.body
            );
            logger.infoLog.info('Enterprise created successfully.');
            res.send({
                code: 201,
                message: 'Enterprise created successfully.',
                enterprise_code: result,
                applicationErrorCode: 0,
            });
        } catch (err) {
            logger.errorLog.error('Error while creating enterprise :: ', err);
            return sendErrorRsp(res, {
                code: 'DELETE_ROLE_FAILED',
                message: 'Unable to delete role failed',
                httpCode: 500,
            });
        }
    }

    // async createEnterprise(req, res) {
    //     try {
    //         console.log(
    //             'in conn create enterprise conntroller ',
    //             req.enterpriseCode
    //         );
    //         const result = await enterpriseService.createRootEnterprise(
    //             req.body,
    //             req.enterpriseCode
    //         );
    //         logger.infoLog.info('Enterprise created successfully.');
    //         res.send({
    //             code: 201,
    //             message: 'Enterprise created successfully.',
    //             enterprise_code: result,
    //             applicationErrorCode: 0,
    //         });
    //     } catch (err) {
    //         logger.errorLog.error('Error while creating enterprise :: ', err);
    //         return sendErrorRsp(res, {
    //             code: 'DELETE_ROLE_FAILED',
    //             message: 'Unable to delete role failed',
    //             httpCode: 500,
    //         });
    //     }
    // }
    async getUserList(req, res) {
        try {
            const result = await enterpriseService.getUsers();
            logger.infoLog.info('result in conntroller in getuserList', {
                result,
            });
            res.send({ users: result });
        } catch (err) {
            logger.errorLog.error('Error in get user list :: ', err);
            return sendErrorRsp(res, {
                code: 'GET_USER_FAILED',
                message: 'Unable to get user failed',
                httpCode: 500,
            });
        }
    }

    async getLoggedInUserDetails(req, res) {
        try {
            const result = await enterpriseService.getLoggedInUserDetails(
                req.userId
            );
            logger.infoLog.info(
                'result in conntroller in getLoggedInUserDetails',
                {
                    result,
                }
            );
            res.send({ users: result });
        } catch (err) {
            logger.errorLog.error('Error in getLoggedInUserDetails :: ', err);
            return sendErrorRsp(res, {
                code: 'GET_USER_FAILED',
                message: 'Unable to getLoggedInUserDetails',
                httpCode: 500,
            });
        }
    }
    async createUser(req, res) {
        try {
            console.log('in conn getrole', req.body);

            await enterpriseService.createUserWithRoles(
                req.body,
                req.enterpriseCode
            );
            logger.infoLog.info('User created successfully.');

            res.send({
                code: 201,
                message: 'user created successfully.',
                applicationErrorCode: 0,
            });
        } catch (err) {
            logger.errorLog.error('Error while creating user :: ', err);
            return sendErrorRsp(res, {
                code: 'DELETE_ROLE_FAILED',
                message: 'Unable to delete role failed',
                httpCode: 500,
            });
        }
    }

    async deleteUser(req, res) {
        try {
            await enterpriseService.deleteUser(req.params.id);
            logger.infoLog.info('delete user by id ');
            res.send({
                code: 200,
                message: 'User deleted successfully.',
                applicationErrorCode: 1114,
            });
        } catch (err) {
            // logger.errorLog.error('Error in get role by id  :: ', err);
            console.log('Error in get role by id  :: ', err);
            return sendErrorRsp(res, {
                code: 'DELETE_USER_FAILED',
                message: 'Unable to delete user failed',
                httpCode: 404,
            });
        }
    }
    async suspendUser(req, res) {
        try {
            await enterpriseService.suspendUser(req.params.id);
            logger.infoLog.info('suspend user controller ');
            res.send({
                code: 200,
                message: 'user suspended successfully.',
                applicationErrorCode: 1114,
            });
        } catch (err) {
            // logger.errorLog.error('Error in get role by id  :: ', err);
            console.log('Error in suspend user by id :: ', err);
            return sendErrorRsp(res, {
                code: 'SUSPEND_USER_FAILED',
                message: 'Unable to suspend user  failed',
                httpCode: 404,
            });
        }
    }
    async activateUser(req, res) {
        try {
            await enterpriseService.activateUser(req.params.id);
            logger.infoLog.info('activate user controller ');
            res.send({
                code: 200,
                message: 'user activated successfully.',
                applicationErrorCode: 1114,
            });
        } catch (err) {
            // logger.errorLog.error('Error in get role by id  :: ', err);
            console.log('Error in activate user by id :: ', err);
            return sendErrorRsp(res, {
                code: 'ACTIVATE_USER_FAILED',
                message: 'Unable to activate user  failed',
                httpCode: 404,
            });
        }
    }

    async getEnterprise(req, res) {
        try {
            const result = await enterpriseService.getEnterpriseDetails(
                req.enterpriseCode
            );
            logger.infoLog.info('result in conntroller in getuserList', {
                result,
            });
            res.send(result);
        } catch (err) {
            logger.errorLog.error('Error in get enterprise :: ', err);
            return sendErrorRsp(res, {
                code: 'GET_ENTERPRISE_FAILED',
                message: 'Unable to get enterprise failed',
                httpCode: 500,
            });
        }
    }
    async suspendEnterprise(req, res) {
        try {
            const result = await enterpriseService.suspendEnterprise(
                req.params.id
            );
            logger.infoLog.info('result in conntroller in suspent enterprise');
            res.send({
                code: 200,
                message: 'Enterprise suspended successfully.',
                applicationErrorCode: 0,
            });
        } catch (err) {
            logger.errorLog.error('Error in suspend enterprise:: ', err);
            return sendErrorRsp(res, {
                code: 'SUSPEND_ENTERPRISE_FAILED',
                message: 'Unable to suspend enterprise failed',
                httpCode: 500,
            });
        }
    }
    async activateEnterprise(req, res) {
        try {
            const result = await enterpriseService.activateEnterprise(
                req.params.id
            );
            logger.infoLog.info('result in conntroller in activate enterprise');
            res.send({
                code: 200,
                message: 'Enterprise activated successfully.',
                applicationErrorCode: 0,
            });
        } catch (err) {
            logger.errorLog.error('Error in activate enterprise :: ', err);
            return sendErrorRsp(res, {
                code: 'ACTIVATE_ENTERPRISE_FAILED',
                message: 'Unable to activate enterprise failed',
                httpCode: 500,
            });
        }
    }
    async deleteEnterprise(req, res) {
        try {
            console.log('in delete enterprises ', req.params.id);
            const result = await enterpriseService.deleteEnterprise(
                req.params.id
            );
            logger.infoLog.info('result in conntroller in delete enterprise');
            res.send({
                code: 200,
                message: 'Enterprise deleted successfully.',
                applicationErrorCode: 0,
            });
        } catch (err) {
            logger.errorLog.error('Error in delete enterprise :: ', err);
            return sendErrorRsp(res, {
                code: 'DELETE_ENTERPRISE_FAILED',
                message: 'Unable to delete enterprise failed',
                httpCode: 500,
            });
        }
    }

    async createPasswordPolicy(req, res) {
        try {
            //console.log('data', req.body);
            await enterpriseService.createPasswordPolicy(
                req.body,
                req.user.enterprise_code
            );
            logger.infoLog.info(
                'result in conntroller in create password policies'
            );
            res.send({
                code: 201,
                message: 'Password policy created successfully.',
                applicationErrorCode: 0,
            });
        } catch (err) {
            logger.errorLog.error('Error in create password policies :: ', err);
            return sendErrorRsp(res, {
                code: 'CREATE_PASSWORD_POLICY_FAILED',
                message: 'Unable to create password policies failed',
                httpCode: 500,
            });
        }
    }
    async getPasswordPolicies(req, res) {
        try {
            const result = await enterpriseService.fetchPasswordPolicies();
            logger.infoLog.info(
                'result in conntroller in fetch password policies'
            );
            res.send({ passwordPolicies: result });
        } catch (err) {
            logger.errorLog.error('Error in fetch password policies :: ', err);
            return sendErrorRsp(res, {
                code: 'FETCH_PASSWORD_POLICY_FAILED',
                message: 'Unable to fetch password policies failed',
                httpCode: 500,
            });
        }
    }

    async activatePasswordPolicy(req, res) {
        try {
            const result = await enterpriseService.activatePasswordPolicy(
                req.params.id
            );
            logger.infoLog.info(
                'result in conntroller in activate passwordPolicy'
            );
            res.send({
                code: 200,
                message: 'Password Policy activated.',
                applicationErrorCode: 0,
            });
        } catch (err) {
            logger.errorLog.error('Error in activate passwordPolicy :: ', err);
            return sendErrorRsp(res, {
                code: 'ACTIVATE_PASSWORDPOLICY_FAILED',
                message: 'Unable to activate passwordPolicy failed',
                httpCode: 500,
            });
        }
    }

    async deActivatePasswordPolicy(req, res) {
        try {
            const result = await enterpriseService.deactivatePasswordPolicy(
                req.params.id
            );
            logger.infoLog.info(
                'result in conntroller in deactivate passwordPolicy'
            );
            res.send({
                code: 200,
                message: 'Password Policy deactivated.',
                applicationErrorCode: 0,
            });
        } catch (err) {
            logger.errorLog.error(
                'Error in deactivate passwordPolicy :: ',
                err
            );
            return sendErrorRsp(res, {
                code: 'DEACTIVATE_PASSWORDPOLICY_FAILED',
                message: 'Unable to deactivate passwordPolicy failed',
                httpCode: 500,
            });
        }
    }

    async deletePasswordPolicy(req, res) {
        try {
            await enterpriseService.deletePasswordPolicy(req.params.id);
            logger.infoLog.info(
                'result in conntroller in delete passwordPolicy'
            );
            res.send({
                code: 200,
                message: 'Password Policy deleted.',
                applicationErrorCode: 0,
            });
        } catch (err) {
            logger.errorLog.error('Error in delete passwordPolicy :: ', err);
            return sendErrorRsp(res, {
                code: 'DELETE_PASSWORDPOLICY_FAILED',
                message: 'Unable to delete passwordPolicy failed',
                httpCode: 500,
            });
        }
    }

    async updatePasswordPolicy(req, res) {
        try {
            await enterpriseService.updatePasswordPolicy(
                req.body,
                req.user.enterprise_code
            );
            logger.infoLog.info(
                'result in conntroller in update passwordPolicy'
            );
            res.send({
                code: 200,
                message: 'Password Policy updated successfully.',
                applicationErrorCode: 0,
            });
        } catch (err) {
            console.log('Error in update passwordPolicy :: ', err);
            logger.errorLog.error('Error in update passwordPolicy :: ', err);

            return sendErrorRsp(res, {
                code: 'UPDATE_PASSWORDPOLICY_FAILED',
                message: 'Unable to update passwordPolicy failed',
                httpCode: 404,
            });
        }
    }

    async activateUserByToken(req, res) {
        try {
            console.log('in conn getrole', req.body);
            const result = await enterpriseService.activateUserByToken(
                req.params.activationKey,
                req.body
            );
            logger.infoLog.info('User activated successfully.');
            // res.send(result);
            res.send({
                code: 201,
                message: 'user activated successfully.',
                applicationErrorCode: 0,
            });
        } catch (err) {
            logger.errorLog.error('Error while activating user :: ', err);
            return sendErrorRsp(res, {
                code: 'ACTIVATE_USER_FAILED',
                message: 'Unable to activate user failed',
                httpCode: 500,
            });
        }
    }

    async getSalt(req, res) {
        try {
            const result = await enterpriseService.getSalt(req.body.username);

            res.send(result);
        } catch (err) {
            logger.errorLog.error('Error while activating user :: ', err);
            return sendErrorRsp(res, {
                code: 'ACTIVATE_USER_FAILED',
                message: 'Unable to activate user failed',
                httpCode: 500,
            });
        }
    }

    async changePassword(req, res) {
        try {
            const result = await enterpriseService.changePassword(req.body);

            res.send({
                code: 201,
                message: 'user passoword changed successfully.',
                applicationErrorCode: 0,
            });
        } catch (err) {
            logger.errorLog.error('Error while changing password :: ', err);
            return sendErrorRsp(res, {
                code: 'CHANGE_PASSWORD_FAILED',
                message: 'Unable to changing password  failed',
                httpCode: 500,
            });
        }
    }

    async forgotPassword(req, res) {
        try {
            const result = await enterpriseService.forgotPassword(
                req.body.username
            );

            res.send({
                code: 201,
                message: 'Activation key generated.',
                applicationErrorCode: 0,
            });
        } catch (err) {
            logger.errorLog.error('Error while forget password :: ', err);
            return sendErrorRsp(res, {
                code: 'CHANGE_PASSWORD_FAILED',
                message: 'Unable to changing password  failed',
                httpCode: 500,
            });
        }
    }

    async authenticateUser(req, res) {
        try {
            const result = await enterpriseService.authenticateUser(req.body);

            res.send(result);
        } catch (err) {
            logger.errorLog.error('Error while authenticating user  :: ', err);
            return sendErrorRsp(res, {
                code: 'CHANGE_PASSWORD_FAILED',
                message: 'Unable to changing password  failed',
                httpCode: 500,
            });
        }
    }
}

module.exports = EnterpriseController;
