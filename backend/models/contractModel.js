const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    contractCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContractCategory',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
}, { collection: "contracts"});

module.exports = mongoose.model('Contract', contractSchema);
