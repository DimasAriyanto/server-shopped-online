const { StatusCodes } = require('http-status-codes');

const {
    getAllUsers,
    createCompany,
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

const createCMSCompany = async (req, res, next) => {
    try {
        const result = await createCompany(req);

        res.status(StatusCodes.CREATED).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const createCompanyAdmin = async (req, res, next) => {
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
    createCMSCompany,
    createCompanyAdmin,
};