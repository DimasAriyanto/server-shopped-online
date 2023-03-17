const Customers = require('../../api/v1/customers/model');
const Products = require('../../api/v1/products/model');
const Orders = require('../../api/v1/orders/model');
const Payments = require('../../api/v1/payments/model');

const {
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
} = require('../../errors');
const { createTokenCustomers, createJWT } = require('../../utils');

const { otpMail } = require('../email');

const signupCustomers = async (req) => {
    const { firstName, lastName, email, password } = req.body;

    let result = await Customers.findOne({
        email,
        status: 'tidak aktif',
    });

    if (result) {
        result.firstName = firstName;
        result.lastName = lastName;
        result.email = email;
        result.password = password;
        result.otp = Math.floor(Math.random() * 9999);
        await result.save();
    } else {
        result = await Customers.create({
            firstName,
            lastName,
            email,
            password,
            otp: Math.floor(Math.random() * 9999),
        });
    }
    await otpMail(email, result);

    delete result._doc.password;
    delete result._doc.otp;

    return result;
};

const activateCustomers = async (req) => {
    const { otp, email } = req.body;
    const check = await Customers.findOne({
        email,
    });

    if (!check) throw new NotFoundError('Akun anda belum terdaftar');

    if (check && check.otp !== otp) throw new BadRequestError('Kode otp salah');

    const result = await Customers.findByIdAndUpdate(
        check._id,
        {
            status: 'aktif',
        },
        { new: true }
    );

    delete result._doc.password;

    return result;
};

const signinCustomers = async (req) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    const result = await Customers.findOne({ email: email });

    if (!result) {
        throw new UnauthorizedError('Invalid Credentials');
    }

    if (result.status === 'tidak aktif') {
        throw new UnauthorizedError('Akun anda belum aktif');
    }

    const isPasswordCorrect = await result.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new UnauthorizedError('Invalid Credentials');
    }

    const token = createJWT({ payload: createTokenCustomers(result) });

    return token;
};

const getAllProducts = async (req) => {
    const result = await Products.find({ statusItem: 'Published' })
        .populate('category')
        .select('_id name price stock');

    return result;
};

const getOneProducts= async (req) => {
    const { id } = req.params;
    const result = await Products.findOne({ _id: id, statusItem: 'Published' })
        .populate('category');

    if (!result) throw new NotFoundError(`Tidak ada produk dengan id :  ${id}`);

    return result;
};

const checkoutOrder = async (req) => {
    const { item, listProducts, personalDetail, payment } = req.body;

    const checkingItem = await Products.findOne({ _id: item });
    if (!checkingItem) {
        throw new NotFoundError('Tidak ada item dengan id : ' + item);
    }

    const checkingPayment = await Payments.findOne({ _id: payment });

    if (!checkingPayment) {
        throw new NotFoundError(
            'Tidak ada metode pembayaran dengan id :' + payment
        );
    }

    let totalPay = 0,
        totalOrderItem = 0;
    await listProducts.forEach((list) => {
        if (list.name === checkingItem.name) {
            if (list.sumItem > checkingItem.stock) {
                throw new NotFoundError('Stock item tidak mencukupi');
            } else {
                checkingItem.stock -= list.sumItem;

                totalOrderItem += list.sumItem;
                totalPay += checkingItem.price * list.sumItem;
            }
        }
    });

    await checkingItem.save();

    const result = new Orders({
        date: new Date(),
        personalDetail: personalDetail,
        totalPay,
        totalOrderItem,
        orderProducts: listProducts,
        customer: req.customers.id,
        payment,
        item,
    });

    await result.save();
    return result;
};

module.exports = {
    signupCustomers,
    activateCustomers,
    signinCustomers,
    getAllProducts,
    getOneProducts,
    checkoutOrder,
};