'use strict'
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const utils = require('../utils/enums');

const authUser = async ( req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.listUserByEmail(email);

        if (!user || !user.lenght || user[0].password !== password ) {
            return res.status(403).json({
                error: "Invalid Login!"
            });
        }

        if (user[0].status !== utils.userStatus.Active){
            return res.status(403).json({
                error: "The account of this user is Inactive."
            });
        }
        delete user[0].password;
        const token = jwt.sign({user}, process.env.SECRET_TOKEN, { expiresIn: "1hour"});

        res.cookie("token", token,{
            httpOnly: false,
        })

        return res.status(200).json({Authorization: `${token}`});
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

let registerUser;
registerUser = async (req, res) => {
    try {
        const Email = req.body.Email;
        const Password = req.body.Password;
        const ConfirmPassword = req.body.confirm_password;
        const userCheckExist = await userService.listUserByEmail(Email)

        if (Object.keys(userCheckExist).length > 0) {
            if (userCheckExist[0].Email === Email) {
                return res.status(409).json({
                    error: "Email already in use!",
                });
            }
        }

        if (userCheckExist[0].Password) {
            delete userCheckExist[0].Password;
        }

        if (Password !== confirmPassword) {
            return res.status(409).json({
                error: "Confirm Password doesn't match the Password!"
            });
        }

        const newUserData = req.body;
        await userService.createUser(newUserData);
        const user = await userService.listUserByEmail(Email);
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