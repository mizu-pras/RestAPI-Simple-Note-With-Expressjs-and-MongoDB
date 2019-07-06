'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./app/routes');

// create app
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure database

const dbConfig = require('./config/database.config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.DB, {
    useNewUrlParser: true, useFindAndModify: false
}).then(() => {
    console.log('connection success');
}).catch(err => {
    console.log(`connection error `, err);
    process.exit();
})

// end database

app.get('/', (req, res) => {
    res.json({
        message: "WELCOME TO NOTE APP"
    })
});

routes(app);

app.listen(3000, () => {
    console.log(`server running`);
})