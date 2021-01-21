const { sendSuccessRsp, sendErrorRsp, successObject } = require('api-rsp');
const { EnterpriseService } = require('../services');
const enterpriseService = new EnterpriseService();

const logger = require('../config/configure-logger');

class EnterpriseController {
    async getPermissions(req, res) {
        try {
            console.log('in conn');
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
            console.log('in conn', req.body);

            await enterpriseService.createRoleWithPermission(req.body);
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
    async createUser(req, res) {
        try {
            console.log('in conn getrole', req.body);
            await enterpriseService.createUserWithRoles(req.body);
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
            const result = await enterpriseService.getEnterpriseDetails();
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
}

module.exports = EnterpriseController;
