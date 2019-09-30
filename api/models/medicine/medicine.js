const mongoose = require('mongoose');
const Category = require('../../models/category/category');
const medicineSchema = mongoose.Schema({
    _id         : mongoose.Schema.Types.ObjectId,
    medicineName: String,
    genericName : String,
    boxSize     :Number,
    expiryDate  :Date,
    shelf       :String,
    category    :{type:mongoose.Schema.Types.ObjectId, ref:'Category'},
    unit        :Number,
    details     :String,
    salePrice   :Number,
    SupplierPrice:Number,
    model       :String,
    tax         :Number,
    supplier    :{type:mongoose.Schema.Types.ObjectId, ref:'Supplier'}

});


module.exports = mongoose.model('Medicine', medicineSchema);
