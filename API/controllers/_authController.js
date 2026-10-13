'use strict'
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const utils = require('../utils/enums');

const authUser = async ( req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.listUserByEmail(email);

        if (!user || !password || user.password !== password ) {
            return res.status(403).json({
                error: "Invalid Login!"
            });
        }

        if (user.status !== utils.userStatus.Active){
            return res.status(403).json({
                error: "The account of this user is Inactive."
            });
        }
        delete user.password;
        const token = jwt.sign({user}, process.env.SECRET_TOKEN, { expiresIn: "1h"});

        res.cookie("token", token,{
            httpOnly: false,
        })

        return res.status(200).json({Authorization: `${token}`});
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const registerUser = async (req, res) => {
    try {
        const { email, password, confirm_password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and Password are required!"
            });
        }

        const userCheckExist = await userService.listUserByEmail(email);

        if (userCheckExist) {
            return res.status(409).json({
                error: "Email already in use!",
            });
        }

        if (password !== confirm_password) {
            return res.status(409).json({
                error: "Confirm Password doesn't match the Password!"
            });
        }

        const user = await userService.createUser(req.body);
        const token = jwt.sign({user}, process.env.SECRET_TOKEN, { expiresIn: "1h"});

        res.cookie("token", token, {
            httpOnly: false,
        });

        return res.status(200).json({Authorization: `${token}`});
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    authUser,
    registerUser
}
