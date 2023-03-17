const Customers = require('../../api/v1/customers/model');
const Items = require('../../api/v1/items/model');
const Orders = require('../../api/v1/orders/model');
const Payments = require('../../api/v1/payments/model');

const {
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
} = require('../../errors');

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

const discountOrder = async (req) => {
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
        totalOrderItem = 0,
        freeRaspberryPi = false,
        googleHomesCount = 0,
        alexaSpeakersCount = 0;

    listItems.forEach((list) => {
        if (list.name === checkingItem.name && list.name === 'MacBook Pro') {
            freeRaspberryPi = true;
            const raspberryPi = Items.findOne({ name: 'Raspberry Pi B' });
            if (raspberryPi.stock > 1) {
                throw new NotFoundError('Stock Raspberry Pi B tidak mencukupi');
            } else if (list.sumItem > checkingItem.stock) {
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

module.exports = { checkoutOrder, discountOrder };