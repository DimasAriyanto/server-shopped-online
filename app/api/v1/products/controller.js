const {
    getAllProducts,
    createProducts,
    getOneProducts,
    updateProducts,
    deleteProducts,
    changeStatusProducts,
} = require('../../../services/mongoose/products');

const { StatusCodes } = require('http-status-codes');

const index = async (req, res, next) => {
    try {
        const result = await getAllProducts(req);

        res.status(StatusCodes.OK).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const create = async (req, res, next) => {
    try {
        const result = await createProducts(req);

        res.status(StatusCodes.CREATED).json({
            data: result,
        });    
    } catch (err) {
        next(err);
    }    
};    

const find = async (req, res, next) => {
    try {
        const result = await getOneProducts(req);

        res.status(StatusCodes.OK).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        const result = await updateProducts(req);

        res.status(StatusCodes.OK).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const destroy = async (req, res, next) => {
    try {
        const result = await deleteProducts(req);

        res.status(StatusCodes.OK).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const changeStatus = async (req, res, next) => {
    try {
        const result = await changeStatusProducts(req);

        res.status(StatusCodes.OK).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    index,
    find,
    update,
    destroy,
    create,
    changeStatus
};