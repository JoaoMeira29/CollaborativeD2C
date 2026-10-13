'use strict';
jest.mock('../models/userModel');
const User = require('../models/userModel');
const userService = require('../services/userService');

beforeEach(() => jest.resetAllMocks());

describe('userService', () => {
    test('listUserByEmail should search by email and return a plain object', async () => {
        User.findOne.mockResolvedValue({ toJSON: () => ({ ID: 1, email: 'alice@example.com', password: 'secret123' }) });

        const user = await userService.listUserByEmail('alice@example.com');

        expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'alice@example.com' } });
        expect(user).toEqual({ ID: 1, email: 'alice@example.com', password: 'secret123' });
    });

    test('listUserByEmail should return null when there is no such user', async () => {
        User.findOne.mockResolvedValue(null);

        expect(await userService.listUserByEmail('nobody@example.com')).toBeNull();
    });

    test('createUser should create an active normal user and hide the password', async () => {
        User.create.mockImplementation(async (data) => ({ toJSON: () => ({ ID: 2, ...data }) }));

        const created = await userService.createUser({ name: 'Bob', email: 'bob@example.com', password: 'secret123' });

        expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Bob', email: 'bob@example.com', status: 'Active', role: 'Normal'
        }));
        expect(created.password).toBeUndefined();
    });

    test('updateUserStatus should change only the status of the given user', async () => {
        User.update.mockResolvedValue([1]);
        User.findByPk.mockResolvedValue({ toJSON: () => ({ ID: 5, status: 'Inactive' }) });

        const updated = await userService.updateUserStatus(5, { status: 'Inactive', role: 'Admin' });

        expect(User.update).toHaveBeenCalledWith({ status: 'Inactive' }, { where: { ID: 5 } });
        expect(updated).toEqual({ ID: 5, status: 'Inactive' });
    });

    test('should let database errors reach the caller', async () => {
        User.findAll.mockRejectedValue(new Error('database is down'));

        await expect(userService.listUsers()).rejects.toThrow('database is down');
    });
});
