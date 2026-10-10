const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

test('keeps the Render HTTP port separate from PostgreSQL', () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '10000';
    delete process.env.POSTGRES_PORT;

    const config = require('../sequelize.config');

    assert.equal(config.port, 5432);
    assert.equal(process.env.PORT, '10000');
});

test('server startup fails when required Render configuration is missing', () => {
    const required = {
        FRONTEND_URL: 'https://example.com',
        JWT_SECRET: 'test-only-secret',
        POSTGRES_DATABASE: 'reaction_test',
        POSTGRES_HOST: '127.0.0.1',
        POSTGRES_PASSWORD: 'reaction_pass',
        POSTGRES_USER: 'reaction_user',
    };

    for (const name of Object.keys(required)) {
        const env = { NODE_ENV: 'test', PATH: process.env.PATH, ...required };
        delete env[name];

        const result = spawnSync(process.execPath, ['server.js'], {
            cwd: path.resolve(__dirname, '..'),
            env,
            encoding: 'utf8',
        });

        assert.notEqual(result.status, 0);
        assert.match(result.stderr, new RegExp(name));
    }
});
