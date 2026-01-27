import request from 'supertest';
import { app, server } from '../index.js';
import pool from '../src/config/db.js';

afterAll((done) => {
    server.close(() => {
        pool.end(done);
    });
});

describe('User API', () => {
    it('should get all users', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});
