const Users = require('../../api/v1/users/model');
const Stores = require('../../api/v1/stores/model');
const { BadRequestError } = require('../../errors');

const createStore = async (req) => {
    const { store, name, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
        throw new BadRequestError('Password dan Konfirmasi password tidak sama');
    }

    const result = await Stores.create({ store });

    const users = await Users.create({
        name,
        email,
        password,
        role,
        store: result._id,
    });

    delete users._doc.password;

    return users;
};

const createAdmin = async (req, res) => {
    const { name, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
        throw new BadRequestError('Password dan Konfirmasi password tidak sama');
    }

    const result = await Users.create({
        name,
        email,
        password,
        role,
        store: req.user.store,
    });

    return result;
};

const getAllUsers = async (req) => {
    const result = await Users.find();

    return result;
};

module.exports = { createStore, createAdmin, getAllUsers };