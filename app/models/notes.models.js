'use strict'

const mongoose = require('mongoose');
const CategoriesModels = require('./categories.models');

const NotesSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    note: {
        type:String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Notes', NotesSchema);