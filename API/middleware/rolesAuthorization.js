'use strict'
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const utils = require('../utils/enums');

const checkRoleAdmin = async (req, res, next) => {
    let token;
    let authHeader = req.headers['authorization'];

    if (!authHeader)
        return res.status(401).json({ message: 'Token not provided' });

    if (authHeader.indexOf(' ') >= 0)
        token = authHeader.split(' ')[1];
    else
        token = authHeader

    try {
        const jwtDecoded = jwt.verify(token, process.env.SECRET_TOKEN);
        const foundUser = await userService.listUserById(jwtDecoded.user.ID);

        if (foundUser.role === utils.userRoles.Admin) {
            next();
        }
        else {
            return res.status(401).json({
                error: 'You are not authorized to view this page'
            })
        }
    } catch (error) {
        return res.status(401).json({ error: `${error.message}`});
    }
}

const checkRoleNormal = async (req, res, next) => {
    let token;
    let authHeader = req.headers['authorization'];

    if (!authHeader)
        return res.status(401).json({ message: 'Token not provided' });

    if (authHeader.indexOf(' ') >= 0)
        token = authHeader.split(' ')[1];
    else
        token = authHeader

    try{
        const jwtDecoded = jwt.verify(token, process.env.SECRET_TOKEN);
        const foundUser = await userService.listUserById(jwtDecoded.user.ID);

        if (foundUser.role === utils.userRoles.Normal ||
            foundUser.role === utils.userRoles.Admin) {
            next();
        }
        else {
            return res.status(401).json({
                error: 'You are not authorised to view this information/page'
            });
        }
    }
    catch (error){
        return res.status(401).json({ error: `${error.message}` });
    }
}

module.exports = {
    checkRoleAdmin,
    checkRoleNormal
}