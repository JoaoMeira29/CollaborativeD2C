'use strict'
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const authUser = async ( req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.listUserByEmail(email);

        if (user?.password !== password ) {
            return res.status(403).json({
                error: "Invalid Login!"
            });
        }

        user.password = undefined
        const token = jwt.sign({user}, process.env.SECRET_TOKEN );

        return res.status(200).json({Authorization: `${token}`});
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

let registerUser;
registerUser = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        const userCheckExist = await userService.listUserByEmail(email)

        if (userCheckExist?.email === email) {
            return res.status(409).json({
                error: "Email already in use!",
            });
        }

        if (password !== confirmPassword) {
            return res.status(409).json({
                error: "Confirm Password doesn't match the Password!"
            });
        }

        const newUserData = req.body;
        const user = await userService.createUser(newUserData);
        user.password = undefined;

        const token = jwt.sign({user}, process.env.SECRET_TOKEN);

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