const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');
const {
    authenticateUser,
    authorizeRoles,
} = require('../../../middlewares/auth');

router.post('/categories', authenticateUser, authorizeRoles('company'), create);
router.get('/categories', authenticateUser, authorizeRoles('company'), index);
router.get('/categories/:id', authenticateUser, authorizeRoles('company'), find);
router.put('/categories/:id', authenticateUser, authorizeRoles('company'), update);
router.delete('/categories/:id', authenticateUser, authorizeRoles('company'), destroy);

module.exports = router;