const Customers = require('../../api/v1/customers/model');
const Items = require('../../api/v1/items/model');
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

const getAllItems = async (req) => {
    const result = await Items.find({ statusItem: 'Published' })
        .populate('category')
        .select('_id name price stock');

    return result;
};

const getOneItem = async (req) => {
    const { id } = req.params;
    const result = await Items.findOne({ _id: id })
        .populate('category');

    if (!result) throw new NotFoundError(`Tidak ada item dengan id :  ${id}`);

    return result;
};

const getAllOrders = async (req) => {
    console.log(req.customers);
    const result = await Orders.find({ customers: req.customers.id });
    return result;
};

const checkoutOrder = async (req) => {
    const { item, listItems, personalDetail, payment } = req.body;

    const checkingItem = await Items.findOne({ _id: item });
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
    await listItems.forEach((list) => {
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
        orderItems: listItems,
        customer: req.customers.id,
        payment,
        item,
    });

    await result.save();
    return result;
};

const getAllPaymentByCompany = async (req) => {
    const { company } = req.params;

    const result = await Payments.find({ company: company });

    return result;
};

module.exports = {
    signupCustomers,
    activateCustomers,
    signinCustomers,
    getAllItems,
    getOneItem,
    getAllOrders,
    checkoutOrder,
    getAllPaymentByCompany,
};