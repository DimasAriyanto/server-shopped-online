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
        company: {
            type: mongoose.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);