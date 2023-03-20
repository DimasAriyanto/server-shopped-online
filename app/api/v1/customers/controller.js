const {
    signupCustomers,
    activateCustomers,
    signinCustomers,
    getAllProducts,
    getOneProducts,
    checkoutOrder,
    discountOrder,
} = require('../../../services/mongoose/customers');

const { StatusCodes } = require('http-status-codes');

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

const getLandingPage = async (req, res, next) => {
    try {
        const result = await getAllProducts(req);

        res.status(StatusCodes.OK).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const getDetailLandingPage = async (req, res, next) => {
    try {
        const result = await getOneProducts(req);

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
    getLandingPage,
    getDetailLandingPage,
    checkout,
    discount
};