'use strict'
const utils = require('../utils/enums');
const User = require('../models/userModel');

const config = require('../config');
const sql = require('mssql');

/**
 * Retrieves a list of users
 * @async
 * @returns {Promise<Array<User> | string>} - A promise that resolves with an array of user objects
 * (with 'password' excluded) or an error message
 */
const listUsers = async () => {
    try {
        return await  User.findAll({
            attributes: { exclude: ['password']},
        });
    } catch (error) {
        return error.message;
    }
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
 * @returns {Promise<User | string>} - A promise that resolves with  the found user object
 * (with 'password' excluded) or an error message
 */
const listUserById = async (ID) => {
    try {
        return await User.findByPk(ID, {
            attributes: { exclude: ['password'] },
        });
    } catch (error) {
        return error.message;
    }
}

/**
 * Finds a user by Email
 * @async
 * @param {string} Email - Email address of the user to search for
 * @returns {Promise<User | string>} - A promise that resolves with the found user object or an error message
 */
const listUserByEmail = async (Email) => {
    try {
        return await User.findOne(ID, {
            where: { email: Email },
        });
    } catch (error) {
        return error.message;
    }
}

/**
 * Creates a new user with the provided user data
 * @async
 * @param {User} userData - Information required to create a new user
 * @returns {Promise<User | string>} - A promise that resolves with the new created user object
 * or an error message
 */
const createUser = async (UserData) => {
    try {
        const newUser = await User.create({
            name: userData.name,
            surname: UserData.surname,
            email: UserData.email,
            password: UserData.password,
            status: utils.userStatus.active,
            role: utils.userRoles.Normal
        });

        return newUser.toJSON();
    } catch (error) {
        return error.message;
    }
}

/**
 * Updates an existing user's information based on the provided ID and userData
 * @async
 * @param {Number} ID - The ID of the user to be updated
 * @param {User} userData - New information to update for the user
 * @returns {Promise<User | {message: string } | string>} - A promise that resolves with the updated user object
 * (with 'password' excluded), a message indicating no update occurred, or an error message
 */
const updateUser = async (ID, userData) => {
    try {
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
    catch(error) {
        return error.message;
    }
}

/**
 * Updates the status of a user
 * @async
 * @param {Number} ID - The ID of the user to be updated
 * @param {User} userData - New information to update for the user
 * @returns {Promise<any>} - A promise containing the result of the update operation
 */
const updateUserStatus = async (ID, userData) => {
    try {
        let pool = await sql.connect(config.sql);
        let query = 'UPDATE [dbo].[User] SET status = @status' +
            'WHERE [status] = @status';

        const update = await pool.request()
            .input('ID', sql.Int, ID)
            .input('status', sql.VarChar(255), userData.status)
            .query(query)

        return update.json;
    }
    catch(error) {
        return error.message;
    }
}

/**
 * Deletes an existing user based on the provided ID
 * @async
 * @param {Number} ID - The ID of the user to be deleted
 * @returns {Promise<{ message: string }> | string} - A promise that resolves with a message indicating successfully deletion,
 * or a message indicating no deletion occurred due to an error
 */
const deleteUser = async (ID) => {
    try {
        const deletedCount = await User.destroy({
            where: { ID: ID },
        });

        if (deletedCount === 0 )
            return { message: 'Something went wrong! The user it was not deleted.'};

        return { message: 'User was deleted successfully.'};
    }
    catch(error) {
        return error.message;
    }
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