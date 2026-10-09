import assert from 'node:assert';
import { createAuthenticatedApi, api } from '../config/request.js';
import { getAuthToken } from '../helpers/auth.js';
import { config } from '../config/config.js';

describe('Authentication', function () {

    it('should authenticate successfully with valid credentials', async function () {
        const response = await api
            .post('/auth/login')
            .send({
                username: config.username,
                password: config.password
            });

        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.username, 'emilys');
        assert.ok(typeof response.body.accessToken === 'string' && 
            response.body.accessToken.length > 0
        );
        
    });

    it('should reject invalid credentials', async function () {

        const response = await api
            .post('/auth/login')
            .send({
                username: config.username,
                password: 'wrongpassword'
            });

        assert.strictEqual(response.status, 400);
        assert.match(response.body.message, /invalid credentials/i);
    });

    describe('Authenticated requests', function () {

        let authApi;

        before(async function () {
            const token = await getAuthToken();
            authApi = createAuthenticatedApi(token);
        });

        it('should return the authenticated user', async function () {

            const response = await authApi.get('/auth/me')

            assert.strictEqual(response.status, 200);

            assert.strictEqual(response.body.id, 1);
            assert.strictEqual(response.body.username, 'emilys');
            assert.strictEqual(response.body.email, 'emily.johnson@x.dummyjson.com');
        });

    
    });

    describe('Authentication failures', function () {

        it('should reject request without authentication token', async function () {

            const response = await api
                .get('/auth/me');

            assert.strictEqual(response.status, 401);
            assert.match(response.body.message, /is required/i);
        });

        it('should reject an invalid token', async function () {

            const response = await api
                .get('/auth/me')
                .set('Authorization', 'Bearer invalid-token');

            assert.strictEqual(response.status, 401);
            assert.match(response.body.message, /invalid/i
            );
        });

    })

});