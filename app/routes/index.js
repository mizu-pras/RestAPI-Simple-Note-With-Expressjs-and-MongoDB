'use strict'

module.exports = (app) => {
    const CategoriesController = require('../controllers/categories.controllers');
    const NotesController = require('../controllers/notes.controllers');

    app.get('/categories', CategoriesController.get);
    app.get('/categories/:id', CategoriesController.getOne);
    app.post('/categories', CategoriesController.create);
    app.patch('/categories/:id', CategoriesController.update);
    app.delete('/categories/:id', CategoriesController.delete);

    app.post('/notes', NotesController.create);
    app.get('/notes', NotesController.get);
    app.get('/notes/:id', NotesController.getOne);
    app.get('/notes/category/:id', NotesController.getByCategory);
    app.patch('/notes/:id', NotesController.update);
    app.delete('/notes/:id', NotesController.delete);
}