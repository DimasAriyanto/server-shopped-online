const express = require('express');
const router = express();
const { create, index, find, update, destroy, changeStatus } = require('./controller');

const {
    authenticateUser,
    authorizeRoles,
} = require('../../../middlewares/auth');

router.get('/items', authenticateUser, authorizeRoles('company'), index);
router.get('/items/:id', authenticateUser, authorizeRoles('company'), find);
router.put('/items/:id', authenticateUser, authorizeRoles('company'), update);
router.delete('/items/:id', authenticateUser, authorizeRoles('company'), destroy);
router.post('/items', authenticateUser, authorizeRoles('company'), create);
router.put('/items/:id/status', authenticateUser, authorizeRoles('company'), changeStatus);

module.exports = router;