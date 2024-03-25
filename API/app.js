'use strict'
const express = require('express');
const cookieParser = require('cookie-parser');
const config = require('./config')
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const authCookie = require('./middleware/authCookieVerify');
const app= express();
const expressWs = require('express-ws')(app);

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/src/app/features/pag-home/pag-home.component.html"));
})
app.get('/HomePage', (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/src/app/features/pag-home/pag-home.component.html"));
})
app.get('/Login', (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/src/app/features/login/login.component.html"));
})
app.get('/Register', (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/src/app/features/register/register.component.html"));
})

const baseUrl='/collaborativeD2C/api'
app.use(baseUrl, require('./routes/_authRoutes').routes);
app.use(baseUrl, require('./routes/userRoutes').routes);

module.exports = app;