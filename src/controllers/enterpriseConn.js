const { sendSuccessRsp, sendErrorRsp, successObject } = require('api-rsp');
const { EnterpriseService } = require('../services');
const enterpriseService = new EnterpriseService();

class EnterpriseController {
    async getPermissions(req, res) {
        try {
            console.log('in conn');

            const result = await enterpriseService.getPermissions();
            console.log('result in conn ', result);
            res.send(result);
        } catch (err) {
            console.error('Error in get permissions :: ', err);
            return sendErrorRsp(res, {
                code: 'GET_PERMISSIONS_FAILED',
                message: 'Unable to get permission failed',
                httpCode: 500,
            });
        }
    }

    async createRolePermission(req, res) {
        try {
            console.log('in conn', req.body);

            await enterpriseService.createRoleWithPermission(req.body);
            res.send({
                code: 201,
                message: 'Role created successfully.',
                applicationErrorCode: 0,
            });
        } catch (err) {
            console.error('Error in get trainer :: ', err);
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

            res.send({ roles: result });
        } catch (err) {
            console.error('Error in get role :: ', err);
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

            const result = await enterpriseService.updateRole(req.body);
            console.log('result in conntroller ', result);
            return sendSuccessRsp(res, {
                code: '200',
                message: 'Role updated successfully.',
                applicationErrorCode: '0',
            });
        } catch (err) {
            console.error('Error in get trainer :: ', err);
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
            console.log('result in conntroller ', result);
            res.status(200).send({ roles: result });
        } catch (err) {
            console.error('Error in get trainer :: ', err);
            return sendErrorRsp(res, {
                code: 'GET_PERMISSIONS_FAILED',
                message: 'Unable to get permission failed',
                httpCode: 500,
            });
        }
    }
    async getPermissionsByFeature(req, res) {
        try {
            const result = await enterpriseService.getPermissionByFeature(
                req.query.feature
            );
            console.log('result in conn ', result);
            res.send(result);
        } catch (err) {
            console.error('Error in get trainer :: ', err);
            return sendErrorRsp(res, {
                code: 'GET_PERMISSIONS_FAILED',
                message: 'Unable to get permission failed',
                httpCode: 500,
            });
        }
    }
    async deleteRole(req, res) {
        try {
            console.log('in conn getrole', req.params.id);

            const result = await enterpriseService.deleteRole(req.params.id);
            console.log('result in conntroller ', result);
            res.status(200).send({ success: true, Users: result });
        } catch (err) {
            console.error('Error in get trainer :: ', err);
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
            console.log('result in conntroller ', result);
            res.send({
                code: 201,
                message: 'Enterprise created successfully.',
                enterprise_code: result,
                applicationErrorCode: 0,
            });
        } catch (err) {
            console.error('Error in get trainer :: ', err);
            return sendErrorRsp(res, {
                code: 'DELETE_ROLE_FAILED',
                message: 'Unable to delete role failed',
                httpCode: 500,
            });
        }
    }
}

module.exports = EnterpriseController;
