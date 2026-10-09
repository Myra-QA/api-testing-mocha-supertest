import fs from 'node:fs';
import path from 'node:path';

export function loadSchema(schemaName) {
    const schemaPath = path.resolve(
        'tests',
        'schemas',
        schemaName
    );

    return JSON.parse(
        fs.readFileSync(schemaPath, 'utf-8')
    );
}