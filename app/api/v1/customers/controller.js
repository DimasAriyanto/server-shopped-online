const {
    signupCustomers,
    activateCustomers,
    signinCustomers,
    getAllItems,
    getOneItem,
    getAllOrders,
    checkoutOrder,
    getAllPaymentByCompany,
} = require('../../../services/mongoose/customers');

const { StatusCodes } = require('http-status-codes');
const { discountOrder } = require('../../../services/mongoose/checkout');

const signup = async (req, res, next) => {
    try {
        const result = await signupCustomers(req);

        res.status(StatusCodes.CREATED).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const activeCustomers = async (req, res, next) => {
    try {
        const result = await activateCustomers(req);

        res.status(StatusCodes.OK).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const signin = async (req, res, next) => {
    try {
        const result = await signinCustomers(req);

        res.status(StatusCodes.OK).json({
            data: { token: result },
        });
    } catch (err) {
        next(err);
    }
};

const getAllLandingPage = async (req, res, next) => {
    try {
        const result = await getAllItems(req);

        res.status(StatusCodes.OK).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const getDashboard = async (req, res, next) => {
    try {
        const result = await getOneItem(req);

        res.status(StatusCodes.OK).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const getDetailLandingPage = async (req, res, next) => {
    try {
        const result = await getAllOrders(req);

        res.status(StatusCodes.OK).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const getAllPayment = async (req, res, next) => {
    try {
        const result = await getAllPaymentByCompany(req);

        res.status(StatusCodes.OK).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const checkout = async (req, res, next) => {
    try {
        const result = await checkoutOrder(req);

        res.status(StatusCodes.CREATED).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const discount = async (req, res, next) => {
    try {
        const result = await discountOrder(req);

        res.status(StatusCodes.CREATED).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signup,
    activeCustomers,
    signin,
    getAllLandingPage,
    getDetailLandingPage,
    getDashboard,
    checkout,
    getAllPayment,
    discount
};