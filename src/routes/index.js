const express = require('express');
const API_CONSTANT = require('../constants/app');

const router = express.Router();

//router.use(API_CONSTANT.PERMISSIONS, require('./enterprise-routes'));
router.use(require('./enterprise-routes'));

module.exports = router;
