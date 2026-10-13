'use strict';
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

jest.mock('../services/userService');
const userService = require('../services/userService');

const baseUrl = '/collaborativeD2C/api';
const storedUser = {
    ID: 1, name: 'Alice', email: 'alice@example.com', password: 'secret123', status: 'Active', role: 'Normal'
};

beforeEach(() => jest.resetAllMocks());

describe('POST /authLogin', () => {
    test('should return a token without the password for valid credentials', async () => {
        userService.listUserByEmail.mockResolvedValue({ ...storedUser });

        const response = await request(app)
            .post(`${baseUrl}/authLogin`)
            .send({ email: 'alice@example.com', password: 'secret123' });

        expect(response.status).toBe(200);
        const decoded = jwt.verify(response.body.Authorization, process.env.SECRET_TOKEN);
        expect(decoded.user.ID).toBe(1);
        expect(decoded.user.password).toBeUndefined();
    });

    test('should reject a wrong password', async () => {
        userService.listUserByEmail.mockResolvedValue({ ...storedUser });

        const response = await request(app)
            .post(`${baseUrl}/authLogin`)
            .send({ email: 'alice@example.com', password: 'wrong' });

        expect(response.status).toBe(403);
    });

    test('should reject an unknown email', async () => {
        userService.listUserByEmail.mockResolvedValue(null);

        const response = await request(app)
            .post(`${baseUrl}/authLogin`)
            .send({ email: 'nobody@example.com', password: 'secret123' });

        expect(response.status).toBe(403);
    });

    test('should reject an inactive account', async () => {
        userService.listUserByEmail.mockResolvedValue({ ...storedUser, status: 'Inactive' });

        const response = await request(app)
            .post(`${baseUrl}/authLogin`)
            .send({ email: 'alice@example.com', password: 'secret123' });

        expect(response.status).toBe(403);
        expect(response.body.error).toMatch(/Inactive/);
    });
});

describe('POST /authRegister', () => {
    const newUser = { name: 'Bob', email: 'bob@example.com', password: 'secret123', confirm_password: 'secret123' };

    test('should create the user and return a token', async () => {
        userService.listUserByEmail.mockResolvedValue(null);
        userService.createUser.mockResolvedValue({ ID: 2, name: 'Bob', email: 'bob@example.com', status: 'Active', role: 'Normal' });

        const response = await request(app).post(`${baseUrl}/authRegister`).send(newUser);

        expect(response.status).toBe(200);
        expect(userService.createUser).toHaveBeenCalledWith(expect.objectContaining({ email: 'bob@example.com' }));
        const decoded = jwt.verify(response.body.Authorization, process.env.SECRET_TOKEN);
        expect(decoded.user.ID).toBe(2);
    });

    test('should reject an email that is already in use', async () => {
        userService.listUserByEmail.mockResolvedValue({ ...storedUser });

        const response = await request(app).post(`${baseUrl}/authRegister`).send(newUser);

        expect(response.status).toBe(409);
        expect(userService.createUser).not.toHaveBeenCalled();
    });

    test('should reject passwords that do not match', async () => {
        userService.listUserByEmail.mockResolvedValue(null);

        const response = await request(app)
            .post(`${baseUrl}/authRegister`)
            .send({ ...newUser, confirm_password: 'different' });

        expect(response.status).toBe(409);
        expect(userService.createUser).not.toHaveBeenCalled();
    });
});

describe('user routes', () => {
    const token = jwt.sign({ user: { ID: 1 } }, process.env.SECRET_TOKEN);

    beforeEach(() => userService.listUserById.mockResolvedValue({ ID: 1, role: 'Admin' }));

    test('PUT /updateUser/:ID should pass the ID from the URL', async () => {
        userService.updateUser.mockResolvedValue({ ID: 5, name: 'New' });

        const response = await request(app)
            .put(`${baseUrl}/updateUser/5`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'New' });

        expect(response.status).toBe(200);
        expect(userService.updateUser).toHaveBeenCalledWith('5', { name: 'New' });
    });

    test('DELETE /deleteUser/:ID should pass the ID from the URL', async () => {
        userService.deleteUser.mockResolvedValue({ message: 'User was deleted successfully.' });

        const response = await request(app)
            .delete(`${baseUrl}/deleteUser/5`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(userService.deleteUser).toHaveBeenCalledWith('5');
    });

    test('should answer 400 when the service fails', async () => {
        userService.listUsers.mockRejectedValue(new Error('database is down'));

        const response = await request(app)
            .get(`${baseUrl}/listUsers`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });
});
