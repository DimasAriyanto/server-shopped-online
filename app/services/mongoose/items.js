const Items = require('../../api/v1/items/model');
const { checkingCategories } = require('./categories');

const { NotFoundError, BadRequestError } = require('../../errors');

const getAllItems = async (req) => {
    const { keyword, category } = req.query;
    let condition = { company: req.user.company };

    if (keyword) {
        condition = { ...condition, name: { $regex: keyword, $options: 'i' } };
    }

    if (category) {
        condition = { ...condition, category: category };
    }

    const result = await Items.find(condition)
        .populate({
            path: 'category',
            select: '_id name',
        });

    return result;
};

const createItems = async (req) => {

    const {
        name,
        about,
        price,
        stock,
        statusItem,
        category,
    } = req.body;

    await checkingCategories(category);

    const check = await Items.findOne({ name, company: req.user.company });

    if (check) throw new BadRequestError('nama item sudah ada');

    const result = await Items.create({
        name,
        about,
        price,
        stock,
        statusItem,
        category,
        company: req.user.company
    });

    return result;
};

const getOneItems = async (req) => {
    const { id } = req.params;

    const result = await Items.findOne({ _id: id, company: req.user.company })
        .populate({
            path: 'category',
            select: '_id name',
        });

    if (!result)
        throw new NotFoundError(`Tidak ada item dengan id :  ${id}`);

    return result;
};

const updateItems = async (req) => {
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

    const check = await Items.findOne({
        name,
        _id: { $ne: id },
    });

    if (check) throw new BadRequestError('nama item sudah ada');

    const result = await Items.findOneAndUpdate(
        { _id: id },
        {
            name,
            about,
            price,
            stock,
            statusItem,
            category,
            company: req.user.company
        },
        { new: true, runValidators: true }
    );

    if (!result) throw new NotFoundError(`Tidak ada item dengan id :  ${id}`);

    return result;
};

const deleteItems = async (req) => {
    const { id } = req.params;

    const result = await Items.findOne({
        _id: id,
        company: req.user.company
    });

    if (!result)
        throw new NotFoundError(`Tidak ada item dengan id :  ${id}`);

    await result.deleteOne();

    return result;
};

const changeStatusItems = async (req) => {
    const { id } = req.params;

    const { statusItem } = req.body;

    if (!['Draft', 'Published'].includes(statusItem)) {
        throw new BadRequestError('Status harus Draft atau Published');
    }
    
    const checkItem = await Items.findOne({
        _id: id,
        organizer: req.user.organizer,
    });

    if (!checkItem)
        throw new NotFoundError(`Tidak ada item dengan id :  ${id}`);

    checkItem.statusItem = statusItem;

    await checkItem.save();

    return checkItem;
};

module.exports = {
    getAllItems,
    createItems,
    getOneItems,
    updateItems,
    deleteItems,
    changeStatusItems
};