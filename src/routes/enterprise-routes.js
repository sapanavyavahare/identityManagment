const express = require('express');
const router = express.Router();

const { EnterpriseController } = require('../controllers');
const enterpriseConn = new EnterpriseController();

router.get('/permissions', enterpriseConn.getPermissions);
router.post('/roles', enterpriseConn.createRolePermission);
router.get('/roles', enterpriseConn.getRolePermissions);
router.put('/roles', enterpriseConn.updateRole);
router.get('/roles/:id', enterpriseConn.getRoleById);
router.get('/permissions/search', enterpriseConn.getPermissionsByFeature);
router.delete('/roles/:id', enterpriseConn.deleteRole);
router.post('/enterprises/root', enterpriseConn.createRootEnterprise);
router.post('/user', enterpriseConn.createRootEnterprise);

module.exports = router;
