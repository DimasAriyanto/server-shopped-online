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
    const result = await Products.find({ statusProduct: 'Published' })
        .populate('category')
        .select('_id name price stock');

    return result;
};

const getOneProducts = async (req) => {
    const { id } = req.params;
    const result = await Products.findOne({ _id: id, statusProduct: 'Published' })
        .populate('category');

    if (!result) throw new NotFoundError(`Tidak ada produk dengan id :  ${id}`);

    return result;
};

const checkoutOrder = async (req) => {
    const { product, listProducts, personalDetail, payment } = req.body;

    const checkingProduct = await Products.findOne({ _id: product });
    if (!checkingProduct) {
        throw new NotFoundError('Tidak ada product dengan id : ' + product);
    }

    const checkingPayment = await Payments.findOne({ _id: payment });

    if (!checkingPayment) {
        throw new NotFoundError(
            'Tidak ada metode pembayaran dengan id :' + payment
        );
    }

    let totalPay = 0,
        totalOrderProduct = 0;
    await listProducts.forEach((list) => {
        if (list.name === checkingProduct.name) {
            if (list.quantity > checkingProduct.stock) {
                throw new NotFoundError('Stock product tidak mencukupi');
            } else {
                checkingProduct.stock -= list.quantity;

                totalOrderProduct += list.quantity;
                totalPay += checkingProduct.price * list.quantity;
            }
        }
    });

    await checkingProduct.save();

    const result = new Orders({
        date: new Date(),
        personalDetail: personalDetail,
        totalPay,
        totalOrderProduct,
        orderProducts: listProducts,
        customer: req.customers.id,
        payment,
        product,
    });

    await result.save();
    return result;
};

const discountOrder = async (req) => {
    const { product, listProducts, personalDetail, payment } = req.body;

    const checkingProduct = await Products.findOne({ _id: product });
    if (!checkingProduct) {
        throw new NotFoundError('Tidak ada product dengan id : ' + product);
    }

    const checkingPayment = await Payments.findOne({ _id: payment });

    if (!checkingPayment) {
        throw new NotFoundError(
            'Tidak ada metode pembayaran dengan id :' + payment
        );
    }

    let totalPay = 0,
        totalOrderProduct = 0,
        freeRaspberryPi = false,
        googleHomesCount = 0,
        alexaSpeakersCount = 0;

    await listProducts.forEach((list) => {

        if (list.name === checkingProduct.name && list.name === 'MacBook Pro') {
            freeRaspberryPi = true;
            if (freeRaspberryPi) {
                const raspberryPi = Products.findOne({ product: 'Raspberry Pi B' });
                if (raspberryPi) {
                    checkingProduct.push(raspberryPi);
                    totalPay += raspberryPi.price;
                }
            }
        }

        if (list.name === checkingProduct.name && list.name === 'Google Home') {
            if (googleHomesCount >= 3) {
                checkingProduct.stock -= list.quantity;

                totalOrderProduct += list.quantity;
                totalPay += checkingProduct.price * list.quantity;

                const numFree = Math.floor(googleHomesCount / 3);
                const googleHome =  Products.findOne({ product: 'Google Home' });
                if (googleHome) {
                    for (let i = 0; i < numFree; i++) {
                        checkingProduct.push(googleHome);
                        totalPay += googleHome.price;
                    }
                }
            }
        }

        if (list.name === checkingProduct.name && list.name === 'Alexa Speaker') {
            if (alexaSpeakersCount > 3) {
                const alexaSpeakers =  Products.find({ product: 'Alexa Speaker' });
                if (alexaSpeakers) {
                    const discount = 0.1; // 10% discount
                    alexaSpeakers.forEach((product) => {
                        checkingProduct.push(product);
                        totalPay += product.price * (1 - discount) * product.quantity;
                    });
                }
            }
        }

    });

    await checkingProduct.save();

    const result = new Orders({
        date: new Date(),
        personalDetail: personalDetail,
        totalPay,
        totalOrderProduct,
        orderProducts: listProducts,
        customer: req.customers.id,
        payment,
        product,
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
    discountOrder
};