const express = require('express');
const router = express();
const { create, index, find, update, destroy, changeStatus } = require('./controller');

const {
    authenticateUser,
    authorizeRoles,
} = require('../../../middlewares/auth');

router.get('/products', authenticateUser, authorizeRoles('store'), index);
router.post('/products', authenticateUser, authorizeRoles('store'), create);
router.get('/products/:id', authenticateUser, authorizeRoles('store'), find);
router.put('/products/:id', authenticateUser, authorizeRoles('store'), update);
router.delete('/products/:id', authenticateUser, authorizeRoles('store'), destroy);
router.put('/products/:id/status', authenticateUser, authorizeRoles('store'), changeStatus);

module.exports = router;