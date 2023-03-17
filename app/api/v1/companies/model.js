const mongoose = require('mongoose');
const { model, Schema } = mongoose;

let companySchema = Schema(
    {
        company: {
            type: String,
            required: [true, 'Perusahaan harus diisi'],
        },
    },
    { timestamps: true }
);

module.exports = model('Company', companySchema);