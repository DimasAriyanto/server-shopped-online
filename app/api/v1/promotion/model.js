const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nama diskon harus diisi'],
    },
    type: {
        type: String
    },
    discount: Number,
});

module.exports = mongoose.model('Promotion', promotionSchema);
