process.env.NODE_ENV = 'test';
process.env.POSTGRES_DATABASE = 'reaction_test';
process.env.POSTGRES_HOST = 'localhost';
process.env.POSTGRES_USER = 'reaction_user';
process.env.POSTGRES_PASSWORD = 'reaction_pass';

const test = require('node:test');
const assert = require('node:assert/strict');
const { Game, Settings, Stats } = require('../src/db/models');

test('dependent models use one required UUID userId foreign key', () => {
    for (const model of [Game, Settings, Stats]) {
        const { userId } = model.rawAttributes;

        assert.equal(model.rawAttributes.UserId, undefined);
        assert.equal(userId.type.key, 'UUID');
        assert.equal(userId.allowNull, false);
        assert.deepEqual(userId.references, { model: 'user', key: 'id' });
    }
});

test('model schemas reject invalid game and settings values', async () => {
    const userId = '065bd7d4-dbf7-49c5-99ab-f6e73d1883a1';

    await assert.doesNotReject(Game.build({ userId, score: 0, time: 0, settings: {} }).validate());
    await assert.doesNotReject(
        Settings.build({
            userId,
            circleSize: 125,
            spawnInterval: 0.25,
            shrinkTime: 2,
        }).validate(),
    );
    await assert.rejects(Game.build({ userId, score: -1, time: 1, settings: {} }).validate());
    await assert.rejects(Settings.build({ userId, circleSize: 25, spawnInterval: 0.3, shrinkTime: 1 }).validate());
});
