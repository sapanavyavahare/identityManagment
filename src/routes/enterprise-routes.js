const express = require('express');
const router = express.Router();

const { EnterpriseController } = require('../controllers');
const enterpriseConn = new EnterpriseController();

const { AuthJwt } = require('../middlewares');
const { VerifySignUp } = require('../middlewares');
const authJwt = new AuthJwt();
const verifySignUp = new VerifySignUp();

const { EnterpriseValidation } = require('../validation');
const enterpriseValidation = new EnterpriseValidation();

router.get('/permissions', authJwt.verifyToken, enterpriseConn.getPermissions);
router.post(
    '/roles',
    authJwt.verifyToken,
    enterpriseValidation.createRoleValidation,
    enterpriseConn.createRolePermission
);
router.get('/roles', authJwt.verifyToken, enterpriseConn.getRolePermissions);
router.put(
    '/roles/:id',
    authJwt.verifyToken,
    enterpriseValidation.paramsIdValidation,
    enterpriseValidation.createRoleValidation,
    enterpriseConn.updateRole
);
router.get(
    '/roles/:id',
    authJwt.verifyToken,
    enterpriseValidation.paramsIdValidation,
    enterpriseConn.getRoleById
);
router.get(
    '/permissions/search',
    authJwt.verifyToken,
    enterpriseConn.getPermissionsByFeature
);
router.delete(
    '/roles/:id',
    authJwt.verifyToken,
    enterpriseValidation.paramsIdValidation,
    enterpriseConn.deleteRole
);
router.post(
    '/enterprises/root',
    enterpriseValidation.createEnterpriseValidation,
    enterpriseConn.createRootEnterprise
);
router.post('/enterprises', [
    authJwt.verifyToken,
    authJwt.isAdmin,
    enterpriseValidation.createEnterpriseValidation,
    enterpriseConn.createRootEnterprise,
]);
router.post(
    '/users',
    [
        authJwt.verifyToken,
        authJwt.isAdmin,
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted,
    ],
    enterpriseValidation.createUserValidation,
    enterpriseConn.createUser
);
router.get(
    '/users/list',
    [authJwt.verifyToken, authJwt.isAdmin],
    enterpriseConn.getUserList
);
router.get(
    '/users',
    authJwt.verifyToken,
    enterpriseConn.getLoggedInUserDetails
);
router.delete(
    '/users/:id',
    authJwt.verifyToken,
    enterpriseValidation.paramsIdValidation,
    enterpriseConn.deleteUser
);
router.put(
    '/users/suspend/:id',
    authJwt.verifyToken,
    enterpriseValidation.paramsIdValidation,
    enterpriseConn.suspendUser
);
router.put(
    '/users/activate/:id',
    authJwt.verifyToken,
    enterpriseValidation.paramsIdValidation,
    enterpriseConn.activateUser
);
router.get(
    '/enterprises',
    [authJwt.verifyToken, authJwt.isAdmin],
    enterpriseConn.getEnterprise
);
router.put(
    '/enterprises/:id/suspend',
    enterpriseValidation.paramsIdValidation,

    enterpriseConn.suspendEnterprise
);
router.put(
    '/enterprises/:id/activate',
    enterpriseValidation.paramsIdValidation,

    enterpriseConn.activateEnterprise
);
router.delete(
    '/enterprises/:id/delete',
    enterpriseValidation.paramsIdValidation,
    enterpriseConn.deleteEnterprise
);
router.post('/enterprises', enterpriseConn.createRootEnterprise);
router.post(
    '/passwordpolicies',
    authJwt.verifyToken,
    enterpriseConn.createPasswordPolicy
);
router.get(
    '/passwordpolicies',
    authJwt.verifyToken,
    enterpriseConn.getPasswordPolicies
);
router.put(
    '/passwordpolicies/:id/activate',
    authJwt.verifyToken,
    enterpriseConn.activatePasswordPolicy
);
router.put(
    '/passwordpolicies/:id/deactivate',
    authJwt.verifyToken,
    enterpriseValidation.paramsIdValidation,
    enterpriseConn.deActivatePasswordPolicy
);
router.delete(
    '/passwordpolicies/:id/',
    authJwt.verifyToken,
    enterpriseValidation.paramsIdValidation,
    enterpriseConn.deletePasswordPolicy
);
router.put(
    '/passwordpolicies',
    authJwt.verifyToken,
    enterpriseConn.updatePasswordPolicy
);
router.post(
    '/users/activation/:activationKey',
    enterpriseValidation.userActivateValidation,
    enterpriseConn.activateUserByToken
);
router.post('/salt', enterpriseConn.getSalt);
router.put(
    '/users/passwd/change',
    authJwt.verifyToken,
    enterpriseValidation.changePassowrdValidation,
    enterpriseConn.changePassword
);
router.post('/users/forgotpassword', enterpriseConn.forgotPassword);
router.post(
    '/auth',
    enterpriseValidation.userPasswordValidation,
    enterpriseConn.authenticateUser
);
router.get('/logout', authJwt.verifyToken, authJwt.logout);

module.exports = router;
