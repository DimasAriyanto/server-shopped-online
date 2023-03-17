const express = require('express');
const router = express();
const {
    signup,
    activeCustomers,
    signin,
    getLandingPage,
    getDetailLandingPage,
    checkout,
    discount,
} = require('./controller');

const { authenticateCustomers } = require('../../../middlewares/auth');

router.post('/customers/auth/signup', signup);
router.post('/customers/auth/signin', signin);
router.put('/customers/active', activeCustomers);
router.get('/', getLandingPage);
router.get('/:id', getDetailLandingPage);
router.post('/products/checkout', authenticateCustomers, checkout);
router.post('/discount', authenticateCustomers, discount);

module.exports = router;