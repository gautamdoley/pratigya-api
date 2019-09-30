const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//calling models
const Category = require('../../models/category/category');

router.get('/', (req, res, next) => {
    Category.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({
                isSuccess:true,
                categories: docs
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
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        categoryName: req.body.CateName
    });

    category.save().then(result => {
        res.status(200).json({
            isSuccess:true,
            message: "Category Added"
        });
    }).catch(err => console.log(err));



    // res.status(201).json({
    //     isSuccess: "true",
    //     message: "New category added.",
    //     category: category
    // });
});
router.get('/:categoryId', (req, res, next) => {
    const id = req.params.categoryId;
    Category.find({_id: id})
        .exec()
        .then(docs => {
            const response = {
                    // count: docs.length,
                    categories: docs.map(doc=>{
                        return {
                            categoryName:doc.categoryName,
                        }
                    })
                }
            res.status(200).json({
                categories: response.categories
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

router.delete('/:categoryId', (req, res, next) => {
    const id = req.params.categoryId;

    Category.findByIdAndRemove(id)
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