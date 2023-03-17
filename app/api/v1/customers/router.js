const express = require('express');
const router = express();
const {
    signup,
    activeCustomers,
    signin,
    getAllLandingPage,
    getDetailLandingPage,
    getDashboard,
    checkout,
    getAllPayment,
    discount,
} = require('./controller');

const { authenticateCustomers } = require('../../../middlewares/auth');

router.post('/auth/signup', signup);
router.post('/auth/signin', signin);
router.put('/active', activeCustomers);
router.get('/items', getAllLandingPage);
router.get('/items/:id', getDetailLandingPage);
router.get('/payments/:organizer', authenticateCustomers, getAllPayment);
router.get('/orders', authenticateCustomers, getDashboard);
router.post('/checkout', authenticateCustomers, checkout);
router.post('/discount', authenticateCustomers, discount);

module.exports = router;