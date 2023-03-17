const { StatusCodes } = require('http-status-codes');

const {
    getAllUsers,
    createStore,
    createAdmin,
} = require('../../../services/mongoose/users');

const getCMSUsers = async (req, res, next) => {
    try {
        const result = await getAllUsers(req);
        res.status(StatusCodes.OK).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const createCMSStore = async (req, res, next) => {
    try {
        const result = await createStore(req);

        res.status(StatusCodes.CREATED).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const createStoreAdmin = async (req, res, next) => {
    try {
        const result = await createAdmin(req);

        res.status(StatusCodes.CREATED).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getCMSUsers,
    createCMSStore,
    createStoreAdmin,
};