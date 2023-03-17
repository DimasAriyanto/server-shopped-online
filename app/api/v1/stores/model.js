const mongoose = require('mongoose');
const { model, Schema } = mongoose;

let storeSchema = Schema(
    {
        store: {
            type: String,
            required: [true, 'Nama toko harus diisi'],
        },
    },
    { timestamps: true }
);

module.exports = model('Store', storeSchema);