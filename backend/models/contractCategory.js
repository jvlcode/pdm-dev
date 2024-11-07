const mongoose = require('mongoose');

const contractCategorySchema = new mongoose.Schema({
    contractGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContractGroup',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
}, { collection: "contractCategories"});

module.exports = mongoose.model('ContractCategory', contractCategorySchema);
