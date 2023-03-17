const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');
const {
    authenticateUser,
    authorizeRoles,
} = require('../../../middlewares/auth');

router.get('/payments', authenticateUser, authorizeRoles('company'), index);
router.get(
    '/payments/:id',
    authenticateUser,
    authorizeRoles('company'),
    find
);
router.put(
    '/payments/:id',
    authenticateUser,
    authorizeRoles('company'),
    update
);
router.delete(
    '/payments/:id',
    authenticateUser,
    authorizeRoles('company'),
    destroy
);
router.post('/payments', authenticateUser, authorizeRoles('company'), create);

module.exports = router;