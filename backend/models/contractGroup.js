const mongoose = require('mongoose');

const contractGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
}, { collection: "contractGroups"});

module.exports = mongoose.model('ContractGroup', contractGroupSchema);
