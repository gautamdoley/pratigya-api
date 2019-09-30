const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//calling models
const Medicine = require('../../models/medicine/medicine');



router.get('/', (req, res, next) => {
    Medicine.find()
        .populate('category')
        .populate('supplier')
        .exec()
        .then(docs => {

            // const response = {
            //     count: docs.length,
            //     medicines: docs.map(doc=>{
            //         return {
            //             _id:doc._id,
            //             medicineName: doc.medicineName,
            //             genericName: doc.genericName,
            //             boxSize: doc.boxSize,
            //             expiryDate: doc.expiryDate,
            //             shelf: doc.shelf,
            //             category:doc.category,
            //             unit: doc.unit,
            //             details: doc.details,
            //             salePrice: doc.salePrice,
            //             SupplierPrice: doc.SupplierPrice,
            //             model: doc.model,
            //             tax: doc.tax,
            //             supplier: doc.supplier
            //         };
            //     })
            // }
            // console.log(docs);
            res.status(200).json({
                isSuccess:true,
                count: docs.length,
                medicines:docs
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
    const medicine = new Medicine({
        _id: new mongoose.Types.ObjectId(),
        medicineName: req.body.medicineName,
        genericName: req.body.genericName,
        boxSize: req.body.boxSize,
        expiryDate: req.body.expiryDate,
        shelf: req.body.medShelf,
        category: req.body.medCate,
        unit: req.body.unit,
        details: req.body.details,
        salePrice: req.body.salePrice,
        SupplierPrice: req.body.supPrice,
        model: req.body.model,
        tax: req.body.tax,
        supplier: req.body.supplier
    });

    medicine.save().then(result => {
        console.log(result);
        res.status(200).json({
            isSuccess:true,
            message:"New medicine created"
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});

router.get('/:medicineID', (req, res, next) => {
    const id = req.params.medicineID;

    Medicine.find({_id: id})
        .populate('category')
        .populate('supplier')
        .exec()
        .then(doc => {
            // console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

});


router.patch('/:medicineID', (req, res, next) => {
    const id = req.params.medicineID;
    // console.log(id);
    // console.log(req.body);
    const updateOps = {};

    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    for (const [key, value] of Object.entries(req.body)) {
        updateOps[key] = value;
      }
    //   console.log(updateOps);
    Medicine.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                isSuccess:true,
                message:'Medicine Updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


router.delete('/:medicineId', (req, res, next) => {
    const id = req.params.medicineId;

    Medicine.findByIdAndRemove(id)
        .exec()
        .then(result => {
            res.status(200).json({
                isSuccess:true,
                message:"Medicine Deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
