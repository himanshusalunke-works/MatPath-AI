const request = require('supertest');
const app = require('../../src/app');

describe('GET /health', () => {
    it('returns 200 with status UP', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('status', 'UP');
        expect(res.body).toHaveProperty('timestamp');
    });
});
