'use strict'
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const app= express();
const expressWs = require('express-ws')(app);

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

const baseUrl='/collaborativeD2C/api'
app.use(baseUrl, require('./routes/_authRoutes').routes);
app.use(baseUrl, require('./routes/userRoutes').routes);

module.exports = app;