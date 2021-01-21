const express = require('express');
const router = express.Router();

const { EnterpriseController } = require('../controllers');
const enterpriseConn = new EnterpriseController();

router.get('/permissions', enterpriseConn.getPermissions);
router.post('/roles', enterpriseConn.createRolePermission);
router.get('/roles', enterpriseConn.getRolePermissions);
router.put('/roles/:id', enterpriseConn.updateRole);
router.get('/roles/:id', enterpriseConn.getRoleById);
router.get('/permissions/search', enterpriseConn.getPermissionsByFeature);
router.delete('/roles/:id', enterpriseConn.deleteRole);
router.post('/enterprises/root', enterpriseConn.createRootEnterprise);
router.post('/users', enterpriseConn.createUser);
router.get('/users/list', enterpriseConn.getUserList);
router.delete('/users/:id', enterpriseConn.deleteUser);
router.put('/users/suspend/:id', enterpriseConn.suspendUser);
router.put('/users/activate/:id', enterpriseConn.activateUser);
router.get('/enterprises', enterpriseConn.getEnterprise);
router.put('/enterprises/:id/suspend', enterpriseConn.suspendEnterprise);
router.put('/enterprises/:id/activate', enterpriseConn.activateEnterprise);
router.post('/enterprises', enterpriseConn.createRootEnterprise);

module.exports = router;
