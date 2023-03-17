const express = require('express');
const router = express();
const {
    createCMSCompany, createCompanyAdmin, getCMSUsers,
} = require('./controller');

const {
    authenticateUser,
    authorizeRoles,
} = require('../../../middlewares/auth');

router.post('/company', authenticateUser, authorizeRoles('owner'), createCMSCompany);
router.post('/admin', authenticateUser, authorizeRoles('company'), createCompanyAdmin);
router.get('/users', authenticateUser, authorizeRoles('owner'), getCMSUsers);

module.exports = router;