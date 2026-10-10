process.env.NODE_ENV = 'test';

if (!process.env.POSTGRES_DATABASE?.endsWith('_test')) {
    throw new Error('POSTGRES_DATABASE must end with _test');
}

const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const { DataTypes } = require('sequelize');
const { Game, Settings, Stats, User, sequelize } = require('../src/db/models');
const gameRepository = require('../src/db/repositories/game.repository');
const userRepository = require('../src/db/repositories/user.repository');
const repairSchema = require('../migrations/5-repair-dependent-schema');

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

before(async () => {
    await sequelize.sync({ force: true });
});

after(async () => {
    await sequelize.close();
});

test('forward migration repairs legacy user foreign keys without losing data', async () => {
    const queryInterface = sequelize.getQueryInterface();
    const user = await userRepository.createUser({ username: 'legacy-user', password: 'hashed-password' });
    const incompleteUser = await User.create({ username: 'incomplete-user', password: 'hashed-password' });
    await Game.create({
        userId: user.id,
        score: 4,
        time: 1200,
        settings: { circleSize: 85, spawnInterval: 1, shrinkTime: 1 },
    });
    await Game.create({
        userId: incompleteUser.id,
        score: 8,
        time: 800,
        settings: { circleSize: 85, spawnInterval: 1, shrinkTime: 1 },
    });

    for (const table of ['stats', 'game', 'settings']) {
        const constraints = await queryInterface.showConstraint(table);
        for (const constraint of constraints) {
            if (constraint.constraintType === 'FOREIGN KEY') {
                await queryInterface.removeConstraint(table, constraint.constraintName);
            }
        }

        await sequelize.query(`ALTER TABLE "${table}" ALTER COLUMN "userId" TYPE VARCHAR(255) USING "userId"::text`);
        if (table === 'game') {
            await sequelize.query('ALTER TABLE "game" ALTER COLUMN "userId" DROP NOT NULL');
        }
        await queryInterface.addColumn(table, 'UserId', {
            type: DataTypes.UUID,
            references: { model: 'user', key: 'id' },
        });
    }

    await sequelize.query('UPDATE "game" SET "UserId" = "userId"::uuid, "userId" = NULL');
    await repairSchema.up(queryInterface);

    for (const table of ['stats', 'game', 'settings']) {
        const columns = await queryInterface.describeTable(table);
        const constraints = await queryInterface.showConstraint(table);
        const userForeignKey = constraints.find((constraint) => constraint.constraintName === `${table}_user_id_fkey`);

        assert.equal(columns.userId.type, 'UUID');
        assert.equal(columns.userId.allowNull, false);
        assert.equal(columns.UserId.type, 'UUID');
        assert.ok(userForeignKey);
    }

    const repairedStats = await Stats.findOne({ where: { userId: incompleteUser.id } });
    const repairedSettings = await Settings.findOne({ where: { userId: incompleteUser.id } });
    assert.deepEqual(
        {
            totalGames: repairedStats.totalGames,
            highScore: repairedStats.highScore,
            highTime: repairedStats.highTime,
        },
        { totalGames: 1, highScore: 8, highTime: 800 },
    );
    assert.deepEqual(
        {
            circleSize: repairedSettings.circleSize,
            spawnInterval: repairedSettings.spawnInterval,
            shrinkTime: repairedSettings.shrinkTime,
        },
        { circleSize: 100, spawnInterval: 1, shrinkTime: 1 },
    );
    assert.equal(await Game.count({ where: { userId: user.id } }), 1);
    await User.destroy({ where: { id: [user.id, incompleteUser.id] } });
    assert.equal(await Game.count({ where: { userId: user.id } }), 0);
    assert.equal(await Stats.count({ where: { userId: user.id } }), 0);
    assert.equal(await Settings.count({ where: { userId: user.id } }), 0);
});

test('account creation rolls back all records when provisioning fails', async () => {
    Settings.addHook('beforeCreate', 'fail-provisioning-test', () => {
        throw new Error('provisioning failed');
    });

    try {
        await assert.rejects(userRepository.createUser({ username: 'rollback-user', password: 'hashed-password' }));
    } finally {
        Settings.removeHook('beforeCreate', 'fail-provisioning-test');
    }

    assert.equal(await User.count({ where: { username: 'rollback-user' } }), 0);
});

test('concurrent game writes keep history and aggregate stats consistent', async () => {
    const user = await userRepository.createUser({ username: 'concurrent-user', password: 'hashed-password' });
    const settings = { circleSize: 85, spawnInterval: 1, shrinkTime: 1 };

    await Promise.all([
        gameRepository.createGame({ userId: user.id, score: 7, time: 4200, settings }),
        gameRepository.createGame({ userId: user.id, score: 9, time: 3800, settings }),
    ]);

    const stats = await Stats.findOne({ where: { userId: user.id } });
    assert.equal(await Game.count({ where: { userId: user.id } }), 2);
    assert.deepEqual(
        { totalGames: stats.totalGames, highScore: stats.highScore, highTime: stats.highTime },
        { totalGames: 2, highScore: 9, highTime: 4200 },
    );
});

test('game pagination remains stable when primary sort values tie', async () => {
    const user = await userRepository.createUser({ username: 'pagination-user', password: 'hashed-password' });
    const settings = { circleSize: 85, spawnInterval: 1, shrinkTime: 1 };

    await Game.bulkCreate([
        { id: '00000000-0000-4000-8000-000000000001', userId: user.id, score: 5, time: 1000, settings },
        { id: '00000000-0000-4000-8000-000000000002', userId: user.id, score: 5, time: 2000, settings },
    ]);

    const first = await gameRepository.getAllGames({
        userId: user.id,
        limit: 1,
        offset: 0,
        sortedBy: 'score',
        sortedOrder: 'ASC',
    });
    const second = await gameRepository.getAllGames({
        userId: user.id,
        limit: 1,
        offset: 1,
        sortedBy: 'score',
        sortedOrder: 'ASC',
    });

    assert.equal(first[0].time, 1000);
    assert.equal(second[0].time, 2000);
});

test('concurrent game creation and deletion keep history and stats consistent', async () => {
    const user = await userRepository.createUser({ username: 'delete-race-user', password: 'hashed-password' });
    const settings = { circleSize: 85, spawnInterval: 1, shrinkTime: 1 };
    await gameRepository.createGame({ userId: user.id, score: 3, time: 1000, settings });

    let releaseCreate;
    let creation;
    let deletion;
    let createReleased = false;
    let deletedBeforeCreateReleased = false;
    let resolveCreatePaused;
    const createPaused = new Promise((resolve) => {
        resolveCreatePaused = resolve;
    });

    Game.addHook('beforeCreate', 'pause-create-for-delete-race', () => {
        resolveCreatePaused();
        return new Promise((resolve) => {
            releaseCreate = resolve;
        });
    });
    Game.addHook('afterBulkDestroy', 'observe-delete-race', () => {
        if (!createReleased) deletedBeforeCreateReleased = true;
    });

    try {
        creation = gameRepository.createGame({ userId: user.id, score: 5, time: 900, settings });
        await createPaused;
        deletion = gameRepository.deleteGamesAndResetStats(user.id);
        await delay(150);
        createReleased = true;
        releaseCreate();
        await Promise.all([creation, deletion]);
    } finally {
        releaseCreate?.();
        await Promise.allSettled([creation, deletion].filter(Boolean));
        Game.removeHook('beforeCreate', 'pause-create-for-delete-race');
        Game.removeHook('afterBulkDestroy', 'observe-delete-race');
    }

    const stats = await Stats.findOne({ where: { userId: user.id } });
    assert.equal(deletedBeforeCreateReleased, false);
    assert.equal(await Game.count({ where: { userId: user.id } }), stats.totalGames);
});

test('failed stats updates roll back the game insert', async () => {
    const user = await userRepository.createUser({ username: 'game-rollback-user', password: 'hashed-password' });

    Stats.addHook('beforeBulkUpdate', 'fail-stats-test', () => {
        throw new Error('stats failed');
    });

    try {
        await assert.rejects(
            gameRepository.createGame({
                userId: user.id,
                score: 3,
                time: 1000,
                settings: { circleSize: 85, spawnInterval: 1, shrinkTime: 1 },
            }),
        );
    } finally {
        Stats.removeHook('beforeBulkUpdate', 'fail-stats-test');
    }

    const stats = await Stats.findOne({ where: { userId: user.id } });
    assert.equal(await Game.count({ where: { userId: user.id } }), 0);
    assert.equal(stats.totalGames, 0);
});
