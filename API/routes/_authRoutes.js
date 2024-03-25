'use strict'
const express = require('express');
const router = express.Router();
const { authUser, registerUser } =
    require('../controllers/_authController');

router.post('/authLogin', authUser);
router.post('/authRegister', registerUser);

module.exports = {
    routes: router
}



