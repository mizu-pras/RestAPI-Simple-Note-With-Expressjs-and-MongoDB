'use strict'

const NotesModels = require('../models/notes.models');

exports.create = async (req, res) => {
    if(!req.body.title || !req.body.note || !req.body.category){
        return res.status(400).json({
            status: 400,
            message: 'title, note, and category not be empty'
        })
    }

    let title = req.body.title;
    let note = req.body.note;
    let category = req.body.category;
    
    const notes = new NotesModels({
        title,
        note,
        category
    })

    await notes.save()
    .then(data => {

        NotesModels.findById(data._id).populate('category')
        .then(dataInsert => {
            res.json({
                status: 200,
                message: 'succes created',
                data: dataInsert
            })  
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

    let limit = (req.query.limit) ? parseInt(req.query.limit) : 10;
    let page  = (req.query.page) ? parseInt(req.query.page) : 1;

    let offset = (page - 1) * limit;

    let search = (req.query.search) ? req.query.search : '';
    let totalRows;

    let sort;
    if(req.query.sort){
        if(req.query.sort.toLowerCase() == 'asc' || req.query.sort.toLowerCase() == 'asc'){
            sort = req.query.sort;
        }
        else{
            sort = 'desc';
        }
    }
    else{
        sort = 'desc';
    }

    await NotesModels.countDocuments({
        'title': {$regex: search, $options: 'i'}
    })
    .then(data => {
        totalRows = data;
    })

    let totalPage = Math.ceil(parseInt(totalRows) / limit);

    await NotesModels.find({
        'title': {$regex: search, $options: 'i'}
    }).populate('category')
    .sort({createdAt: sort})
    .limit(limit)
    .skip(offset)
    .then(data => {
        res.json({
            status: 200,
            message: 'get notes success',
            totalRows: totalRows,
            limit: limit,
            page: page,
            totalPage: totalPage,
            data: data
        })
    })
    .catch(err => {
        return res.status(500).json({
            status: 500,
            message: err.message,
            data: []
        })
    })

}

exports.getByCategory = async (req, res) => {

    let limit = (req.query.limit) ? parseInt(req.query.limit) : 10;
    let page  = (req.query.page) ? parseInt(req.query.page) : 1;

    let offset = (page - 1) * limit;

    let search = (req.query.search) ? req.query.search : '';
    let totalRows;

    let sort;
    if(req.query.sort){
        if(req.query.sort.toLowerCase() == 'asc' || req.query.sort.toLowerCase() == 'asc'){
            sort = req.query.sort;
        }
        else{
            sort = 'desc';
        }
    }
    else{
        sort = 'desc';
    }

    await NotesModels.countDocuments({
        'title': {$regex: search, $options: 'i'}
    })
    .where('category').equals(req.params.id)
    .then(data => {
        totalRows = data;
    })

    await NotesModels.find({
        'title': {$regex: search, $options: 'i'}
    }).populate('category')
    .where('category').equals(req.params.id)
    .sort({createdAt: sort})
    .limit(limit)
    .skip(offset)
    .then(data => {
        res.json({
            status: 200,
            message: 'get notes by category success',
            totalRows: totalRows,
            limit: limit,
            page: page,
            data: data
        })
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

    await NotesModels.findById(req.params.id).populate('category')
    .then(data => {
        if (!data) {
            return res.status(404).json({
                status: 404,
                message: `Notes not found width id = ${req.params.id}`,
                data: []
            })         
        }

        res.json({
            status: 200,
            message: `Notes found width id = ${req.params.id}`,
            data: data
        })
    })
    .catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                status: 404,
                message: `Notes not found width id = ${req.params.id}`,
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

    if(!req.body.title || !req.body.note || !req.body.category){
        return res.status(400).json({
            status: 400,
            message: 'title, note, and category not be empty'
        })
    }

    let title = req.body.title;
    let note = req.body.note;
    let category = req.body.category;

    await NotesModels.findByIdAndUpdate(req.params.id, {
        title,
        note,
        category
    }, {new: true})
    .then(data => {
        if(!data) {
            return res.status(404).json({
                status: 404,
                message: `Notes not found width id = ${req.params.id}`,
                data: []
            }) 
        }

        NotesModels.findById(data._id).populate('category')
        .then(dataUpdate => {
            res.json({
                status: 200,
                message: `sucess updated`,
                data: dataUpdate
            })   
        })
    })
    .catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                status: 404,
                message: `Notes not found width id = ${req.params.id}`,
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

    await NotesModels.findByIdAndDelete(req.params.id)
    .then(data => {
        if(!data) {
            res.status(404).json({
                status: 404,
                message: `Notes not found width id = ${req.params.id}`
            })
        }

        res.json({
            status: 200,
            message: `Notes success with id = ${req.params.id}`,
            _id: req.params.id
        })
    })
    .catch(err => {
        if(err.kind === 'ObjectId') {
            res.status(404).json({
                status: 404,
                message: `Notes not found width id = ${req.params.id}`
            })
        }

        res.status(500).json({
            status: 500,
            message: err.message
        })
    })

}