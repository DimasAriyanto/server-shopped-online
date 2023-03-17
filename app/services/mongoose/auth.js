const Users = require('../../api/v1/users/model');
const { BadRequestError, UnauthorizedError } = require('../../errors');
const { createTokenUser, createJWT } = require('../../utils');

const signin = async (req) => {
    const { email, password } = req.body;

    if (!password) {
        throw new BadRequestError('Tolong masukkan Password');
    }

    if (!email) {
        throw new BadRequestError('Tolong masukkan Email');
    }

    const result = await Users.findOne({ email: email });

    if (!result) {
        throw new UnauthorizedError('Email dan Password salah');
    }

    const isPasswordCorrect = await result.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new UnauthorizedError('Email dan Password salah');
    }

    const token = createJWT({ payload: createTokenUser(result) });

    return { token };
};

module.exports = { signin };