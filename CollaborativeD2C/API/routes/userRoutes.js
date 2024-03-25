'use strict'
const express = require('express');
const router = express.Router();
const { checkRoleAdmin, checkRoleNormal } =
    require("../middleware/rolesAuthorization");
const { getUsers, getUserById, getUserByEmail, addUser, updateUser, updateUserStatus, deleteUser } =
    require("../controllers/userController");

router.get('/listUsers', checkRoleAdmin, getUsers);
router.get('/listUser/:ID', checkRoleNormal, getUserById);
router.get('/listUserByEmail', checkRoleAdmin, getUserByEmail);

router.post('/createUser', checkRoleAdmin, addUser);

router.put('/updateUser/:ID', checkRoleNormal, updateUser);

router.patch('/updateUserStatus/:ID', checkRoleNormal, updateUserStatus);


router.delete('/deleteUser/:ID', checkRoleNormal, deleteUser);

module.exports = {
    routes: router
}

