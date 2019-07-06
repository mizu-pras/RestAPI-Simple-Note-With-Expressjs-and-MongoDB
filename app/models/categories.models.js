'use strict'

const mongoose = require('mongoose');

const CategoriesSchema = mongoose.Schema({
    name_category: {
        type: String,
        required: true,
        lowercase: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Categories', CategoriesSchema);