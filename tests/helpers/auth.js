import assert from 'node:assert';
import { api } from '../config/request.js';
import { config } from '../config/config.js';

export async function getAuthToken() {
    
    const response = await api
        .post('/auth/login')
        .send({
            username: config.username,
            password: config.password
        });

    assert.strictEqual(
        response.status,
        200,
        'Login failed: expected status 200'
    );

    const token = response.body.accessToken;

    assert.ok(
        typeof token === 'string' && token.length > 0,
        'Login failed: access token is missing or empty'
    );

    return token;
}
