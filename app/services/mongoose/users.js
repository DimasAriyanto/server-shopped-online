const Users = require('../../api/v1/users/model');
const Companies = require('../../api/v1/companies/model');
const { BadRequestError } = require('../../errors');

const createCompany = async (req) => {
    const { company, name, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
        throw new BadRequestError('Password dan Konfirmasi password tidak sama');
    }

    const result = await Companies.create({ company });

    const users = await Users.create({
        name,
        email,
        password,
        role,
        company: result._id,
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
        company: req.user.company,
    });

    return result;
};

const getAllUsers = async (req) => {
    const result = await Users.find();

    return result;
};

module.exports = { createCompany, createAdmin, getAllUsers };