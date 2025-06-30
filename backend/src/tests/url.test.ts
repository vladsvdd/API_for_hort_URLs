import request from 'supertest';
import app from '../app';
import { sequelize, Url } from "../models/url.model";

describe('POST /shorten', () => {
    beforeAll(async () => {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('Successful URL shortening', () => {
        it('should create a short URL with required fields', async () => {
            const testUrl = 'https://example.com';
            const response = await request(app)
                .post('/api/shorten')
                .send({ originalUrl: testUrl });

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                shortUrl: expect.stringMatching(/^[a-zA-Z0-9]{6,8}$/),
                originalUrl: testUrl,
                expiresAt: null,
                clickCount: 0,
                createdAt: expect.any(String)
            });
        });

        it('should create a short URL with custom short code', async () => {
            const testUrl = 'https://example.com';
            const alias = 'mycode';
            const response = await request(app)
                .post('/api/shorten')
                .send({
                    originalUrl: testUrl,
                    alias
                });

            expect(response.status).toBe(200);
            expect(response.body.shortUrl).toBe(alias);
        });

        it('should create a short URL with expiration date', async () => {
            const testUrl = 'https://example.com';
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
            const response = await request(app)
                .post('/api/shorten')
                .send({
                    originalUrl: testUrl,
                    expiresAt
                });

            expect(response.status).toBe(200);
            expect(response.body.expiresAt).toBe(expiresAt);
        });
    });

    describe('Validation tests', () => {
        it('should return 400 for missing originalUrl', async () => {
            const response = await request(app)
                .post('/api/shorten')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('originalUrl is required');
        });

        it('should return 400 for invalid URL format', async () => {
            const response = await request(app)
                .post('/api/shorten')
                .send({ originalUrl: 'not-a-url' });

            expect(response.status).toBe(400);
            expect(response.body.error).toMatch(/Invalid URL/);
        });

        it('should return 400 for custom alias with invalid characters', async () => {
            const response = await request(app)
                .post('/api/shorten')
                .send({
                    originalUrl: 'https://example.com',
                    alias: 'invalid alias!'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Alias must be alphanumeric');
        });

        it('should return 400 for custom code that is too short', async () => {
            const response = await request(app)
                .post('/api/shorten')
                .send({
                    originalUrl: 'https://example.com',
                    alias: 'abc'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Alias must be at least 4 characters');
        });

        it('should return 400 for custom code that is too long', async () => {
            const response = await request(app)
                .post('/api/shorten')
                .send({
                    originalUrl: 'https://example.com',
                    alias: 'abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Alias must be no more than 20 characters');
        });

        it('should return 400 for past expiration date', async () => {
            const pastDate = new Date(Date.now() - 1000).toISOString();
            const response = await request(app)
                .post('/api/shorten')
                .send({
                    originalUrl: 'https://example.com',
                    expiresAt: pastDate
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Expiration date must be in the future');
        });
    });

    describe('Conflict tests', () => {
        it('should return 409 for duplicate custom code', async () => {
            const alias = 'mylink';

            // First request should succeed
            await request(app)
                .post('/api/shorten')
                .send({
                    originalUrl: 'https://first.com',
                    alias
                });

            // Second request with same code should fail
            const response = await request(app)
                .post('/api/shorten')
                .send({
                    originalUrl: 'https://second.com',
                    alias
                });

            expect(response.status).toBe(409);
            expect(response.body.error).toBe('URL alias already exists');
        });
    });

    describe('Edge cases', () => {
        it('should handle very long URLs', async () => {
            const longUrl = 'https://example.com/' + 'a'.repeat(2000);
            const response = await request(app)
                .post('/api/shorten')
                .send({ originalUrl: longUrl });

            expect(response.status).toBe(200);
            expect(response.body.originalUrl).toBe(longUrl);
        });

        it('should normalize URLs before saving', async () => {
            const url1 = 'https://example.com';
            const url2 = 'https://example.com/';

            const response1 = await request(app)
                .post('/api/shorten')
                .send({ originalUrl: url1 });

            const response2 = await request(app)
                .post('/api/shorten')
                .send({ originalUrl: url2 });

            expect(response1.body.shortUrl).not.toBe(response2.body.shortUrl);
        });
    });
});