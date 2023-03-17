const Categories = require('../../api/v1/categories/model');

const { NotFoundError, BadRequestError } = require('../../errors');

const getAllCategories = async (req) => {
    const result = await Categories.find({ company: req.user.company });

    return result;
};

const createCategories = async (req) => {
    const { name } = req.body;

    const check = await Categories.findOne({
        name,
        company: req.user.company,
    });

    if (check) throw new BadRequestError('kategori nama duplikat');

    const result = await Categories.create({
        name,
        company: req.user.company,
    });

    return result;
};

const getOneCategories = async (req) => {
    const { id } = req.params;

    const result = await Categories.findOne({ _id: id, company: req.user.company });

    if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id :  ${id}`);

    return result;
};

const updateCategories = async (req) => {
    const { id } = req.params;
    const { name } = req.body;

    const check = await Categories.findOne({
        name,
        company: req.user.company,
        _id: { $ne: id },
    });

    if (check) throw new BadRequestError('kategori nama duplikat');

    const result = await Categories.findOneAndUpdate(
        { _id: id },
        { name },
        { new: true, runValidators: true }
    );

    if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id :  ${id}`);

    return result;
};

const deleteCategories = async (req) => {
    const { id } = req.params;
    
    const result = await Categories.findOne({
        _id: id,
        company: req.user.company,
    });
    
    if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id :  ${id}`);

    await result.deleteOne();

    return result;
};

const checkingCategories = async (id) => {
    const result = await Categories.findOne({ _id: id });

    if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id :  ${id}`);

    return result;
};

module.exports = {
    getAllCategories,
    createCategories,
    getOneCategories,
    updateCategories,
    deleteCategories,
    checkingCategories
};