const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//calling models
const Supplier = require('../../models/supplier/supplier');

router.get('/', (req, res, next) => {
    Supplier.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({
                isSuccess:true,
                suppliers: docs
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    const supplier = new Supplier({
        _id: new mongoose.Types.ObjectId(),
        supplierName: req.body.SupName
    });

    supplier.save().then(result => {
        res.status(200).json({
            isSuccess:true,
            message: "Supplier Added",
            // supplier:supplier
        });
    }).catch(err => console.log(err));



    // res.status(201).json({
    //     isSuccess: "true",
    //     message: "New category added.",
    //     category: category
    // });
});
router.get('/:supplierId', (req, res, next) => {
    const id = req.params.supplierId;
    Supplier.find({_id: id})
        .exec()
        .then(docs => {
            const response = {
                    // count: docs.length,
                    suppliers: docs.map(doc=>{
                        return {
                            supplierName:doc.supplierName,
                        }
                    })
                }
            res.status(200).json({
                suppliers: response.suppliers
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                categories:{
                    categoryName:'No Name'
                }
            });
        });
});

router.delete('/:supplierId', (req, res, next) => {
    const id = req.params.supplierId;

    Supplier.findByIdAndRemove(id)
        .exec()
        .then(result => {
            res.status(200).json({
                isSuccess:true,
                message:"Category Deleted",
                result:result
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                isSuccess:false,
                error: err
            });
        });
});

module.exports = router;