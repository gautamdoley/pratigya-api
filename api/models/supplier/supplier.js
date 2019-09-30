const mongoose = require('mongoose');

const supplierSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    supplierName: String
});


module.exports = mongoose.model('Supplier', supplierSchema);