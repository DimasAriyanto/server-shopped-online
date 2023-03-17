const express = require('express');
const router = express();
const {
    getCMSUsers, createCMSStore, createStoreAdmin,
} = require('./controller');

const {
    authenticateUser,
    authorizeRoles,
} = require('../../../middlewares/auth');

router.get('/users', authenticateUser, authorizeRoles('superadmin'), getCMSUsers);
router.post('/store', authenticateUser, authorizeRoles('superadmin'), createCMSStore);
router.post('/admin', authenticateUser, authorizeRoles('store'), createStoreAdmin);

module.exports = router;