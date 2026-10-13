'use strict'
const utils = require('../utils/enums');
const User = require('../models/userModel');

const config = require('../config');
const sql = require('mssql');

/**
 * Retrieves a list of users
 * @async
 * @returns {Promise<Array<User>>} - A promise that resolves with an array of user objects
 * (with 'password' excluded)
 */
const listUsers = async () => {
    return await  User.findAll({
        attributes: { exclude: ['password']},
    });
}

const listUsersHardcoded = async () => {
    try {
        let pool = await sql.connect(config.sql);
        let query = 'Select *' +
            'From [dbo].[User]' +
            'Where [ID] = @ID';

        const oneUser = await pool.request()
            .input('ID', sql.Int, ID)
            .query(query);

        return oneUser.recordset;
    } catch (error) {
        return error.message;
    }
}

/**
 * Finds a user by ID
 * @async
 * @param {number} ID - ID of the user to search for
 * @returns {Promise<User | null>} - A promise that resolves with  the found user object
 * (with 'password' excluded) or null
 */
const listUserById = async (ID) => {
    return await User.findByPk(ID, {
        attributes: { exclude: ['password'] },
    });
}

/**
 * Finds a user by Email
 * @async
 * @param {string} Email - Email address of the user to search for
 * @returns {Promise<User | null>} - A promise that resolves with the found user object
 * (with 'password' included, so it can be checked on login) or null
 */
const listUserByEmail = async (Email) => {
    const oneUser = await User.findOne({
        where: { email: Email },
    });

    return oneUser ? oneUser.toJSON() : null;
}

/**
 * Creates a new user with the provided user data
 * @async
 * @param {User} userData - Information required to create a new user
 * @returns {Promise<User>} - A promise that resolves with the new created user object
 * (with 'password' excluded)
 */
const createUser = async (userData) => {
    const newUser = await User.create({
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        password: userData.password,
        status: utils.userStatus.Active,
        role: utils.userRoles.Normal
    });

    const created = newUser.toJSON();
    delete created.password;
    return created;
}

/**
 * Updates an existing user's information based on the provided ID and userData
 * @async
 * @param {Number} ID - The ID of the user to be updated
 * @param {User} userData - New information to update for the user
 * @returns {Promise<User | {message: string }>} - A promise that resolves with the updated user object
 * (with 'password' excluded) or a message indicating no update occurred
 */
const updateUser = async (ID, userData) => {
    const [updatedCount] = await User.update(userData, {
        where: {ID: ID},
    });

    if (updatedCount === 0)
        return { message: 'Something went wrong! User it didnt got updated'};

    const updatedUser = await User.findByPk(ID, {
        attributes: { exclude: ['password'] },
    });
    return updatedUser.toJSON();
}

/**
 * Updates the status of a user
 * @async
 * @param {Number} ID - The ID of the user to be updated
 * @param {User} userData - New information to update for the user
 * @returns {Promise<User | {message: string }>} - A promise that resolves with the updated user object
 * (with 'password' excluded) or a message indicating no update occurred
 */
const updateUserStatus = async (ID, userData) => {
    return updateUser(ID, { status: userData.status });
}

/**
 * Deletes an existing user based on the provided ID
 * @async
 * @param {Number} ID - The ID of the user to be deleted
 * @returns {Promise<{ message: string }>} - A promise that resolves with a message indicating successfully deletion,
 * or a message indicating no deletion occurred
 */
const deleteUser = async (ID) => {
    const deletedCount = await User.destroy({
        where: { ID: ID },
    });

    if (deletedCount === 0 )
        return { message: 'Something went wrong! The user it was not deleted.'};

    return { message: 'User was deleted successfully.'};
}

module.exports = {
    listUsers,
    listUserById,
    listUserByEmail,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser
}
