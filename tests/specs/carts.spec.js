import assert from 'node:assert';
import { api } from '../config/request.js';
import * as cartData from '../testdata/cartData.js';
import { loadSchema } from '../helpers/schemaLoader.js';
import { validateSchema } from '../helpers/schemaValidator.js';

const cartSchema = loadSchema('cart-schema.json');

describe('Carts API', function () {

    it('should get an existing cart and conform to schema', async function () {
        const response = await api
            .get('/carts/1')
            .expect('Content-Type', /json/);

        assert.strictEqual(response.status, 200);
        validateSchema(response.body, cartSchema);
        
        assert.strictEqual(response.body.id, 1);
        assert.ok(response.body.products.length > 0);
        assert.strictEqual(typeof response.body.total, 'number');
        assert.ok(response.body.total >= response.body.discountedTotal);
    });

    it('should return 404 for a non-existing cart', async function () {
        const response = await api
            .get('/carts/9999')

        assert.strictEqual(response.status, 404)
        assert.match(response.body.message, /not found/i);
    });

    it('should get carts by a specific user', async function () {
        const userId = 5;
        const response = await api
            .get(`/carts/user/${userId}`);

        assert.strictEqual(response.status, 200);
        assert.ok(Array.isArray(response.body.carts));
        assert.ok(response.body.carts.length > 0);

        response.body.carts.forEach(cart => {
            assert.strictEqual(cart.userId, userId);
        });
    });

    it('should paginate carts correctly', async function () {

        const limit = 5;
        const skip = 5;

        const response = await api
            .get('/carts')
            .query({
                limit, skip
            });

        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.limit, limit);
        assert.strictEqual(response.body.skip, skip);
        assert.ok(Array.isArray(response.body.carts));
        assert.strictEqual(response.body.carts.length, limit);

        assert.strictEqual(typeof response.body.total, 'number');
        assert.ok(response.body.total > 0);

    });

    it('should create a cart and calculate total quantity correctly', async function () {

        const payload = cartData.validCartPayload();
        const response = await api
            .post('/carts/add')
            .send(payload);

        assert.strictEqual(response.status, 201);
        validateSchema(response.body, cartSchema);
        assert.strictEqual(response.body.userId, payload.userId);
        assert.strictEqual(response.body.products.length, payload.products.length);

        const totalQuantityExpected = payload.products.reduce((sum, p) => sum + p.quantity, 0);
        assert.strictEqual(response.body.totalQuantity, totalQuantityExpected);
        assert.ok(response.body.total > 0);
    });

    it('should accept minimum product quantity boundary (qty: 1)', async function () {
        const response = await api
            .post('/carts/add')
            .send(cartData.minimumQuantityCartPayload());

        assert.strictEqual(response.status, 201);
        assert.strictEqual(response.body.products[0].quantity, 1);
    });

    it('should reject cart when userId is missing', async function () {
        const invalidPayload = cartData.invalidCartPayload()

        const response = await api
            .post('/carts/add')
            .send(invalidPayload);

        assert.strictEqual(response.status, 400);
        assert.match(response.body.message, /user id is required/i);
    });


    it('should create an empty cart with an invalid product', async function () {
        const response = await api
            .post('/carts/add')
            .send(cartData.invalidProductCartPayload());

        assert.strictEqual(response.status, 201);
        assert.ok(Array.isArray(response.body.products));
        assert.strictEqual(response.body.products.length, 0);
        assert.strictEqual(response.body.total, 0);
        assert.strictEqual(response.body.totalQuantity, 0);
    })

    it('should update cart items with the supplied values', async function () {
        const updatePayload = cartData.updateCartPayload();
        const response = await api
            .put('/carts/1')
            .send(updatePayload);

        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.id, 1);
        assert.deepStrictEqual(
            response.body.products.map(({ id, quantity }) => ({ id, quantity })),
            updatePayload.products
        );

    });

    it('should return 404 when updating a non-existent cart', async function () {
        const response = await api
            .put('/carts/999999')
            .send(cartData.updateCartPayload());

        assert.strictEqual(response.status, 404);
        assert.match(response.body.message, /not found/i);
    });

    it('should delete a cart successfully', async function () {

        const response = await api
            .delete('/carts/1');

        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.isDeleted, true);

        const ISO_TIMESTAMP_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        assert.match(response.body.deletedOn, ISO_TIMESTAMP_REGEX);

    });

    it('should return 404 when deleting a non-existent cart', async function () {
        const response = await api
            .delete('/carts/999999');

        assert.strictEqual(response.status, 404);
        assert.match(
            response.body.message,
            /not found/i
        );
    });


});
