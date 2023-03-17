const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nama item harus diisi'],
    },
    sumItem: {
        type: Number,
        required: true,
    }
});

const orderSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        personalDetail: {
            Name: {
                type: String,
                required: [true, 'Please provide Name'],
                minlength: 3,
                maxlength: 50,
            },
            Address: {
                type: String,
                required: [true, 'Please provide Address'],
                minlength: 5,
                maxlength: 50,
            },
            numberPhone: {
                type: String,
                required: [true, 'Please provide Number Phone'],
            },
        },
        status: {
            type: String,
            enum: ['pending', 'paid'],
            default: 'pending',
        },
        totalPay: {
            type: Number,
            required: true,
        },
        totalOrderItem: {
            type: Number,
            required: true,
        },
        orderItems: [orderDetailSchema],
        customer: {
            type: mongoose.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        payment: {
            type: mongoose.Types.ObjectId,
            ref: 'Payment',
            required: true,
        },
        item: {
            type: mongoose.Types.ObjectId,
            ref: 'Item',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);