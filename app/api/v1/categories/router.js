const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');
const {
    authenticateUser,
    authorizeRoles,
} = require('../../../middlewares/auth');

router.get('/categories', authenticateUser, authorizeRoles('store'), index);
router.post('/categories', authenticateUser, authorizeRoles('store'), create);
router.get('/categories/:id', authenticateUser, authorizeRoles('store'), find);
router.put('/categories/:id', authenticateUser, authorizeRoles('store'), update);
router.delete('/categories/:id', authenticateUser, authorizeRoles('store'), destroy);

module.exports = router;