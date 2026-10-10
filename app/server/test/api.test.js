process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-only-secret';
process.env.POSTGRES_DATABASE = 'reaction_test';
process.env.POSTGRES_HOST = 'localhost';
process.env.POSTGRES_USER = 'reaction_user';
process.env.POSTGRES_PASSWORD = 'reaction_pass';

const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const { sequelize } = require('../src/db/sequelize-connection');
const { Settings, Stats } = require('../src/db/models');
const gameRepository = require('../src/db/repositories/game.repository');
const settingsRepository = require('../src/db/repositories/settings.repository');
const statsRepository = require('../src/db/repositories/stats.repository');
const userRepository = require('../src/db/repositories/user.repository');
const jwt = require('../src/util/jwt.util');

const userA = '065bd7d4-dbf7-49c5-99ab-f6e73d1883a1';
const userB = 'f314ea40-e4a7-4982-bc3a-eb60d2496b43';
let server;
let origin;

before(
    () =>
        new Promise((resolve) => {
            server = app.listen(0, '127.0.0.1', () => {
                origin = `http://127.0.0.1:${server.address().port}`;
                resolve();
            });
        }),
);

after(
    () =>
        new Promise((resolve, reject) => {
            server.close((error) => (error ? reject(error) : resolve()));
        }),
);

const cookie = (userId = userA) => `token=${jwt.sign({ id: userId, username: 'player' })}`;

const request = async (path, { body, headers, ...options } = {}) => {
    const response = await fetch(`${origin}${path}`, {
        ...options,
        headers: {
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
            ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    return { response, json: await response.json() };
};

test('health reports database readiness', async (t) => {
    t.mock.method(sequelize, 'authenticate', async () => {});

    const { response, json } = await request('/health');

    assert.equal(response.status, 200);
    assert.deepEqual(json, { status: 'ok' });
});

test('health reports dependency failure without leaking details', async (t) => {
    t.mock.method(sequelize, 'authenticate', async () => {
        throw new Error('database hostname');
    });

    const { response, json } = await request('/health');

    assert.equal(response.status, 503);
    assert.deepEqual(json, { status: 'unavailable' });
});

test('data routes deny anonymous requests', async () => {
    const requests = [
        ['/game', {}],
        ['/settings', {}],
        ['/stats', {}],
        [
            '/game',
            {
                method: 'POST',
                body: {
                    score: 1,
                    time: 1000,
                    settings: { circleSize: 85, spawnInterval: 1, shrinkTime: 1 },
                },
            },
        ],
        ['/settings', { method: 'PUT', body: { circleSize: 85, spawnInterval: 1, shrinkTime: 1 } }],
        [`/game/${userB}`, { method: 'DELETE' }],
        [`/users/${userB}`, { method: 'DELETE' }],
    ];

    for (const [path, options] of requests) {
        const { response } = await request(path, options);
        assert.equal(response.status, 401);
    }
});

test('data routes reject invalid tokens', async () => {
    const { response } = await request('/game', { headers: { Cookie: 'token=invalid' } });
    assert.equal(response.status, 401);
});

test('game reads use token ownership instead of a supplied userId', async (t) => {
    let query;
    t.mock.method(gameRepository, 'getAllGames', async (input) => {
        query = input;
        return [{ score: 7, time: 4200, settings: { circleSize: 85, spawnInterval: 1, shrinkTime: 1 } }];
    });

    const { response, json } = await request(
        `/game?userId=${userB}&limit=10&offset=0&sortedBy=createdAt&sortedOrder=DESC`,
        { headers: { Cookie: cookie() } },
    );

    assert.equal(response.status, 200);
    assert.equal(query.userId, userA);
    assert.equal(json.games[0].score, 7);
});

test('game queries normalize validated numbers before persistence', async (t) => {
    let query;
    t.mock.method(gameRepository, 'getAllGames', async (input) => {
        query = input;
        return [];
    });

    const { response } = await request('/game?limit=1e2&offset=2e1', {
        headers: { Cookie: cookie() },
    });

    assert.equal(response.status, 200);
    assert.equal(query.limit, 100);
    assert.equal(query.offset, 20);
});

test('game writes reject invalid input before persistence', async (t) => {
    const createGame = t.mock.method(gameRepository, 'createGame', async () => ({}));

    const { response } = await request('/game', {
        method: 'POST',
        headers: { Cookie: cookie() },
        body: {
            userId: userB,
            score: -1,
            time: 4200,
            settings: { circleSize: 85, spawnInterval: 1, shrinkTime: 1 },
            stats: { totalGames: 999 },
        },
    });

    assert.equal(response.status, 400);
    assert.equal(createGame.mock.callCount(), 0);
});

test('registration rejects invalid credentials before persistence', async (t) => {
    const createUser = t.mock.method(userRepository, 'createUser', async () => ({}));

    const invalidUsername = await request('/users/auth', {
        method: 'POST',
        body: { username: 'x', password: 'valid-password' },
    });
    const invalidPassword = await request('/users/auth', {
        method: 'POST',
        body: { username: 'valid-user', password: 'short' },
    });

    assert.equal(invalidUsername.response.status, 400);
    assert.equal(invalidPassword.response.status, 400);
    assert.equal(createUser.mock.callCount(), 0);
});

test('login accepts credentials created before registration limits', async (t) => {
    const lookup = t.mock.method(userRepository, 'getUserWithPasswordByUsername', async () => undefined);

    const { response } = await request('/users/login', {
        method: 'POST',
        body: { username: 'x', password: 'y' },
    });

    assert.equal(response.status, 404);
    assert.equal(lookup.mock.callCount(), 1);
});

test('login falls back to the normalized registration username', async (t) => {
    const lookup = t.mock.method(userRepository, 'getUserWithPasswordByUsername', async () => undefined);

    const { response } = await request('/users/login', {
        method: 'POST',
        body: { username: ' x ', password: 'y' },
    });

    assert.equal(response.status, 404);
    assert.equal(lookup.mock.callCount(), 2);
    assert.equal(lookup.mock.calls[0].arguments[0], ' x ');
    assert.equal(lookup.mock.calls[1].arguments[0], 'x');
});

test('game writes ignore client identity and aggregate statistics', async (t) => {
    let game;
    t.mock.method(gameRepository, 'createGame', async (input) => {
        game = input;
        return { totalGames: 2, highScore: 7, highTime: 4200 };
    });

    const { response, json } = await request('/game', {
        method: 'POST',
        headers: { Cookie: cookie() },
        body: {
            userId: userB,
            score: 7,
            time: 4200,
            settings: { circleSize: 85, spawnInterval: 1, shrinkTime: 1 },
            stats: { totalGames: 999, highScore: 999, highTime: 999 },
        },
    });

    assert.equal(response.status, 201);
    assert.equal(game.userId, userA);
    assert.equal(game.stats, undefined);
    assert.deepEqual(json, { totalGames: 2, highScore: 7, highTime: 4200 });
});

test('settings updates validate ranges and use token ownership', async (t) => {
    let update;
    t.mock.method(settingsRepository, 'updateSettings', async (input) => {
        update = input;
    });

    const valid = await request('/settings', {
        method: 'PUT',
        headers: { Cookie: cookie() },
        body: { userId: userB, circleSize: 25, spawnInterval: 0.25, shrinkTime: 2 },
    });
    const invalid = await request('/settings', {
        method: 'PUT',
        headers: { Cookie: cookie() },
        body: { circleSize: 25, spawnInterval: 0.3, shrinkTime: 2 },
    });

    assert.equal(valid.response.status, 200);
    assert.equal(update.userId, userA);
    assert.equal(invalid.response.status, 400);
});

test('stats and settings responses expose model fields at the top level', async (t) => {
    t.mock.method(statsRepository, 'getStatsById', async () =>
        Stats.build({ userId: userA, totalGames: 2, highScore: 7, highTime: 4200 }),
    );
    t.mock.method(settingsRepository, 'getSettingsById', async () =>
        Settings.build({ userId: userA, circleSize: 85, spawnInterval: 1, shrinkTime: 1 }),
    );
    const headers = { Cookie: cookie() };

    const stats = await request('/stats', { headers });
    const settings = await request('/settings', { headers });

    assert.equal(stats.json.totalGames, 2);
    assert.equal(settings.json.circleSize, 85);
    assert.equal(stats.json.dataValues, undefined);
    assert.equal(settings.json.dataValues, undefined);
});

test('game filters reject malformed JSON before querying', async (t) => {
    const getGames = t.mock.method(gameRepository, 'getGamesBySetting', async () => []);

    const { response } = await request('/game/filter/settings?filters=not-json', {
        headers: { Cookie: cookie() },
    });

    assert.equal(response.status, 400);
    assert.equal(getGames.mock.callCount(), 0);
});

test('game queries reject unknown sort and filter fields', async (t) => {
    const getAll = t.mock.method(gameRepository, 'getAllGames', async () => []);
    const getFiltered = t.mock.method(gameRepository, 'getGamesBySetting', async () => []);
    const headers = { Cookie: cookie() };

    const sorted = await request('/game?sortedBy=password&sortedOrder=DESC', { headers });
    const unknownFilters = encodeURIComponent(JSON.stringify([{ filter: 'password', value: 1 }]));
    const inheritedFilters = encodeURIComponent(JSON.stringify([{ filter: 'constructor', value: 1 }]));
    const filtered = await request(`/game/filter/settings?filters=${unknownFilters}`, { headers });
    const inherited = await request(`/game/filter/settings?filters=${inheritedFilters}`, { headers });

    assert.equal(sorted.response.status, 400);
    assert.equal(filtered.response.status, 400);
    assert.equal(inherited.response.status, 400);
    assert.equal(getAll.mock.callCount(), 0);
    assert.equal(getFiltered.mock.callCount(), 0);
});

test('destructive routes use token ownership instead of path parameters', async (t) => {
    const deleteGames = t.mock.method(gameRepository, 'deleteGamesAndResetStats', async () => {});
    const deleteUser = t.mock.method(userRepository, 'deleteUser', async () => {});
    const headers = { Cookie: cookie() };

    const games = await request(`/game/${userB}`, { method: 'DELETE', headers });
    const user = await request(`/users/${userB}`, { method: 'DELETE', headers });

    assert.equal(games.response.status, 200);
    assert.equal(user.response.status, 200);
    assert.equal(deleteGames.mock.calls[0].arguments[0], userA);
    assert.equal(deleteUser.mock.calls[0].arguments[0], userA);
});

test('unexpected failures return a generic server error', async (t) => {
    t.mock.method(console, 'error', () => {});
    t.mock.method(gameRepository, 'getAllGames', async () => {
        throw new Error('SELECT password FROM user');
    });

    const { response, json } = await request('/game', { headers: { Cookie: cookie() } });

    assert.equal(response.status, 500);
    assert.deepEqual(json, { message: 'Internal server error' });
});
