const Products = require('../../api/v1/products/model');
const { checkingCategories } = require('./categories');

const { NotFoundError, BadRequestError } = require('../../errors');

const getAllProducts = async (req) => {
    let condition = { store: req.user.company };

    const result = await Products.find(condition)
        .populate({
            path: 'category',
            select: 'name',
        }).populate({
            path: 'store',
            select: 'store'
        });

    return result;
};

const createProducts = async (req) => {
    const {
        name,
        about,
        price,
        stock,
        statusItem,
        category,
    } = req.body;

    await checkingCategories(category);

    const check = await Products.findOne({ name, store: req.user.store });

    if (check) throw new BadRequestError('nama product sudah ada');

    const result = await Products.create({
        name,
        about,
        price,
        stock,
        statusItem,
        category,
        store: req.user.store
    });

    return result;
};

const getOneProducts = async (req) => {
    const { id } = req.params;

    const result = await Products.findOne({ _id: id, store: req.user.store })
        .populate({
            path: 'category',
            select: '_id name',
        }).populate({
            path: 'store',
            select: 'store'
        });

    if (!result)
        throw new NotFoundError(`Tidak ada product dengan id :  ${id}`);

    return result;
};

const updateProducts = async (req) => {
    const { id } = req.params;
    const {
        name,
        about,
        price,
        stock,
        statusItem,
        category,
    } = req.body;

    await checkingCategories(category);

    const check = await Products.findOne({
        name,
        _id: { $ne: id },
    });

    if (check) throw new BadRequestError('nama product sudah ada');

    const result = await Products.findOneAndUpdate(
        { _id: id },
        {
            name,
            about,
            price,
            stock,
            statusItem,
            category,
            store: req.user.store
        },
        { new: true, runValidators: true }
    );

    if (!result) throw new NotFoundError(`Tidak ada product dengan id :  ${id}`);

    return result;
};

const deleteProducts = async (req) => {
    const { id } = req.params;

    const result = await Products.findOne({
        _id: id,
        store: req.user.store
    });

    if (!result)
        throw new NotFoundError(`Tidak ada product dengan id :  ${id}`);

    await result.deleteOne();

    return result;
};

const changeStatusProducts = async (req) => {
    const { id } = req.params;

    const { statusItem } = req.body;

    if (!['Draft', 'Published'].includes(statusItem)) {
        throw new BadRequestError('Status harus Draft atau Published');
    }
    
    const checkProduct = await Products.findOne({
        _id: id,
        organizer: req.user.organizer,
    });

    if (!checkProduct)
        throw new NotFoundError(`Tidak ada item dengan id :  ${id}`);

    checkProduct.statusItem = statusItem;

    await checkProduct.save();

    return checkProduct;
};

module.exports = {
    getAllProducts,
    createProducts,
    getOneProducts,
    updateProducts,
    deleteProducts,
    changeStatusProducts
};