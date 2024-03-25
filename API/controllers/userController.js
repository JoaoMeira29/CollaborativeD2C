'use strict'
const userService = require('../services/userService');
const { join } = require("path");

const getUsers = async (req, res) => {
    try {
        const users = await userService.listUsers();
        res.send(users);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const getUserById = async (req, res) => {
    try {
        const userID = req.params.ID;
        const oneUser = await userService.listUserById(userID);
        res.send(oneUser);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const getUserByEmail = async (req, res) => {
    try {
        const userEmail = req.params.email;
        const oneUser = await userService.listUserByEmail(userEmail);
        res.send(oneUser);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const addUser = async (req, res) => {
    try {
        const data = req.body;
        const created = await userService.createUser(data);
        res.send(created);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const updateUser = async (req, res) => {
    try {
        const userID = req.params.body;
        const data = req.body;
        const created = await userService.updateUser(userID, data);
        res.send(created);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const updateUserStatus = async (req, res) => {
    try {
        const userID = req.params.body;
        const data = req.body;
        const created = await userService.updateUserStatus(userID, data);
        res.send(created);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteUser = async (req, res) => {
    try {
        const userID = req.params.body;
        const deleted = await userService.deleteUser(userID);
        res.send(deleted);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    getUsers,
    getUserById,
    getUserByEmail,
    addUser,
    updateUser,
    updateUserStatus,
    deleteUser
}