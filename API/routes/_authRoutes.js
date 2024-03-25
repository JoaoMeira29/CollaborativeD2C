'use strict'
const express = require('express');
const authController = require('../controllers/_authController');
const authCookie = require('../middleware/authCookieVerify');
const checkRole = require('../middleware/rolesAuthorization')
const router = express.Router();

const { authUser, registerUser } = authController;

router.post('/authLogin', authUser);
router.post('/authRegister', registerUser);

module.exports = {
    routes: router
}



