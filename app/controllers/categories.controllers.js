'use strict'

const CategoriesModels = require('../models/categories.models');

exports.create = async (req, res) => {

    if(!req.body.name_category){
        return res.status(400).json({
            status: 400,
            message: 'name category not be empty'
        });
    }

    const category = new CategoriesModels({
        name_category: req.body.name_category,
        image: req.body.image || 'default'
    })

    await category.save()
    .then((data) => {
        res.json({
            status: 200,
            message: 'success created category',
            data: data
        })
    })
    .catch(err => {
        return res.status(500).json({
            status: 500,
            message: err.message || 'same error'
        })
    })

}

exports.get = async (req, res) => {

    await CategoriesModels.find()
    .sort({createdAt: 'desc'})
    .then(data => {
        res.json({
            status: 200,
            message: 'success get data categories',
            data: data
        });
    })
    .catch(err => {
        return res.status(500).json({
            status: 500,
            message: err.message,
            data: []
        })
    })

}

exports.getOne = async (req, res) => {

    await CategoriesModels.findById(req.params.id)
    .then(data => {
        if (!data) {
            return res.status(404).json({
                status: 404,
                message: `Category not found width id = ${req.params.id}`,
                data: []
            })         
        }

        res.json({
            status: 200,
            message: `Category found width id = ${req.params.id}`,
            data: data
        })
    })
    .catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                status: 404,
                message: `Category not found width id = ${req.params.id}`,
                data: []
            })
        }

        return res.status(500).json({
            status: 500,
            message: err.message,
            data: []
        })
    })

}

exports.update = async (req, res) => {

    if(!req.body.name_category){
        return res.status(400).json({
            status: 400,
            message: 'name category cannot empty'
        })
    }

    await CategoriesModels.findByIdAndUpdate(req.params.id, {
        name_category: req.body.name_category,
        image: req.body.image || 'default'
    }, {new: true})
    .then(data => {
        if(!data) {
            return res.status(404).json({
                status: 404,
                message: `Category not found width id = ${req.params.id}`,
                data: []
            }) 
        }

        res.json({
            status: 200,
            message: `sucess updated`,
            data: data
        }) 
    })
    .catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                status: 404,
                message: `Category not found width id = ${req.params.id}`,
                data: []
            }) 
        }

        return res.status(500).json({
            status: 500,
            message: err.message,
            data: []
        }) 
    })

}

exports.delete = async (req, res) => {

    await CategoriesModels.findByIdAndDelete(req.params.id)
    .then(data => {
        if(!data) {
            res.status(404).json({
                status: 404,
                message: `Category not found width id = ${req.params.id}`
            })
        }

        res.json({
            status: 200,
            message: `Deleted success with id = ${req.params.id}`,
            _id: req.params.id
        })
    })
    .catch(err => {
        if(err.kind === 'ObjectId') {
            res.status(404).json({
                status: 404,
                message: `Category not found width id = ${req.params.id}`
            })
        }

        res.status(500).json({
            status: 500,
            message: err.message
        })
    })

}

