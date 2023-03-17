const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: [true, 'Tipe pembayaran harus diisi'],
            minlength: 3,
            maxlength: 50,
        },
        status: {
            type: Boolean,
            enum: [true, false],
            default: true,
        },
        store: {
            type: mongoose.Types.ObjectId,
            ref: 'Store',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);