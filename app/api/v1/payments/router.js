const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');
const {
    authenticateUser,
    authorizeRoles,
} = require('../../../middlewares/auth');

router.get('/payments', authenticateUser, authorizeRoles('store'), index);
router.get(
    '/payments/:id',
    authenticateUser,
    authorizeRoles('store'),
    find
);
router.put(
    '/payments/:id',
    authenticateUser,
    authorizeRoles('store'),
    update
);
router.delete(
    '/payments/:id',
    authenticateUser,
    authorizeRoles('store'),
    destroy
);
router.post('/payments', authenticateUser, authorizeRoles('store'), create);

module.exports = router;