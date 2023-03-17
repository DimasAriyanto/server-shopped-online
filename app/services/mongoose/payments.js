const Payments = require('../../api/v1/payments/model');

const { NotFoundError, BadRequestError } = require('../../errors');

const getAllPayments = async (req) => {
    let condition = { store: req.user.store };

    const result = await Payments.find(condition);

    return result;
};

const createPayments = async (req) => {
    const { type } = req.body;

    const check = await Payments.findOne({ type, store: req.user.store });

    if (check) throw new BadRequestError('Tipe pembayaran sudah ada');

    const result = await Payments.create({
        type,
        store: req.user.store,
    });

    return result;
};

const getOnePayments = async (req) => {
    const { id } = req.params;

    const result = await Payments.findOne({
        _id: id,
        store: req.user.store,
    });

    if (!result)
        throw new NotFoundError(`Tidak ada tipe pembayaran dengan id :  ${id}`);

    return result;
};

const updatePayments = async (req) => {
    const { id } = req.params;
    const { type } = req.body;

    const check = await Payments.findOne({
        type,
        store: req.user.store,
        _id: { $ne: id },
    });

    if (check) throw new BadRequestError('Tipe pembayaran sudah ada');

    const result = await Payments.findOneAndUpdate(
        { _id: id },
        { store: req.user.store },
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
        store: req.user.store,
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