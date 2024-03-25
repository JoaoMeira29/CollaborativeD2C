const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
require('dotenv').config();

describe('GET /listUsers', () => {
   test('should return a list of users', async () => {
     const response = request(app)
         .get('/collaborativeD2C/api/listUsers');

     expect(response.status).toBe(200);
     expect(Array.isArray(response.body)).toBe(true);
   });
});