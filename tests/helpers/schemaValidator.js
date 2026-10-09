import Ajv from 'ajv';
import assert from 'node:assert';

const ajv = new Ajv();

export function validateSchema(data, schema) {
    const validate = ajv.compile(schema);
    const valid = validate(data);

    assert.strictEqual(
        valid,
        true,
        `Schema validation failed: ${JSON.stringify(validate.errors, null, 2)}`
    );
}