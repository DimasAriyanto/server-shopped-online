const Payments = require('../../api/v1/payments/model');

const { NotFoundError, BadRequestError } = require('../../errors');

const getAllPayments = async (req) => {
    let condition = { company: req.user.company };

    const result = await Payments.find(condition);

    return result;
};

const createPayments = async (req) => {
    const { type } = req.body;

    const check = await Payments.findOne({ type, company: req.user.company });

    if (check) throw new BadRequestError('Tipe pembayaran duplikat');

    const result = await Payments.create({
        type,
        company: req.user.company,
    });

    return result;
};

const getOnePayments = async (req) => {
    const { id } = req.params;

    const result = await Payments.findOne({
        _id: id,
        company: req.user.company,
    });

    if (!result)
        throw new NotFoundError(`Tidak ada tipe pembayaran dengan id :  ${id}`);

    return result;
};

const updatePayments = async (req) => {
    const { id } = req.params;
    const { type, image } = req.body;

    const check = await Payments.findOne({
        type,
        company: req.user.company,
        _id: { $ne: id },
    });

    if (check) throw new BadRequestError('Tipe pembayaran duplikat');

    const result = await Payments.findOneAndUpdate(
        { _id: id },
        { company: req.user.company },
        { new: true, runValidators: true }
    );

    if (!result)
        throw new NotFoundError(`Tidak ada tipe pembayaran dengan id :  ${id}`);

    return result;
};

const deletePayments = async (req) => {
    const { id } = req.params;

    const result = await Payments.findOne({
        _id: id,
        company: req.user.company,
    });

    if (!result)
        throw new NotFoundError(`Tidak ada tipe pembayaran dengan id :  ${id}`);

    await result.deleteOne();

    return result;
};

const checkingPayments = async (id) => {
    const result = await Payments.findOne({ _id: id });

    if (!result)
        throw new NotFoundError(`Tidak ada tipe pembayaran dengan id :  ${id}`);

    return result;
};

module.exports = {
    getAllPayments,
    createPayments,
    getOnePayments,
    updatePayments,
    deletePayments,
    checkingPayments,
};