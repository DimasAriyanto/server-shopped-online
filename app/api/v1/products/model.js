const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Nama harus diisi'],
            minlength: 3,
            maxlength: 50,
        },
        about: {
            type: String,
        },
        price: {
            type: Number,
            default: 0,
        },
        stock: {
            type: Number,
            default: 0,
        },
        statusProduct: {
            type: String,
            enum: ['Draft', 'Published'],
            default: 'Draft',
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        store: {
            type: mongoose.Types.ObjectId,
            ref: 'Store',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);