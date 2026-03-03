'use strict';
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

jest.mock('../services/userService');
const userService = require('../services/userService');

afterAll(done => done());

describe('GET /listUsers', () => {
    test('should return a list of users', async () => {
        const fakeUsers = [{ ID: 1, name: 'Alice' }, { ID: 2, name: 'Bob' }];

        // checkRoleAdmin calls listUserById to verify the requester is an Admin
        userService.listUserById.mockResolvedValue({ ID: 1, role: 'Admin' });
        userService.listUsers.mockResolvedValue(fakeUsers);

        const token = jwt.sign({ user: { ID: 1 } }, process.env.SECRET_TOKEN);

        const response = await request(app)
            .get('/collaborativeD2C/api/listUsers')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
