import request from 'supertest';
import { config } from './config.js'

export const api = request(config.baseUrl);

export function createAuthenticatedApi(token) {
    return {
        get: (path) =>
            api.get(path).set('Authorization', `Bearer ${token}`),

        post: (path) =>
            api.post(path).set('Authorization', `Bearer ${token}`),

        put: (path) =>
            api.put(path).set('Authorization', `Bearer ${token}`),

        delete: (path) =>
            api.delete(path).set('Authorization', `Bearer ${token}`)
    };
}


