const { DataTypes } = require('sequelize');

const dependentTables = ['stats', 'game', 'settings'];

const removeUserForeignKeys = async (queryInterface, table, transaction) => {
    const constraints = await queryInterface.showConstraint(table, { transaction });

    for (const constraint of constraints) {
        if (constraint.constraintType === 'FOREIGN KEY') {
            await queryInterface.removeConstraint(table, constraint.constraintName, { transaction });
        }
    }
};

const repairUserId = async (queryInterface, table, transaction) => {
    const columns = await queryInterface.describeTable(table, { transaction });
    if (!columns.userId) throw new Error(`${table}.userId does not exist`);

    if (columns.UserId) {
        const value = columns.userId.type.startsWith('UUID') ? '"UserId"::uuid' : '"UserId"::text';
        await queryInterface.sequelize.query(
            `UPDATE "${table}" SET "userId" = ${value} WHERE "userId" IS NULL AND "UserId" IS NOT NULL`,
            { transaction },
        );
    }

    await removeUserForeignKeys(queryInterface, table, transaction);
    // ponytail: keep the legacy column for one rolling deploy; remove it after old instances stop.

    if (!columns.userId.type.startsWith('UUID')) {
        await queryInterface.sequelize.query(
            `ALTER TABLE "${table}" ALTER COLUMN "userId" TYPE UUID USING "userId"::uuid`,
            { transaction },
        );
    }

    await queryInterface.sequelize.query(`ALTER TABLE "${table}" ALTER COLUMN "userId" SET NOT NULL`, {
        transaction,
    });
    await queryInterface.addConstraint(table, {
        fields: ['userId'],
        type: 'foreign key',
        name: `${table}_user_id_fkey`,
        references: { table: 'user', field: 'id' },
        onDelete: 'CASCADE',
        transaction,
    });
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            for (const table of dependentTables) await repairUserId(queryInterface, table, transaction);

            await queryInterface.sequelize.query(
                `UPDATE "stats"
                 SET "totalGames" = COALESCE("totalGames", 0),
                     "highScore" = COALESCE("highScore", 0),
                     "highTime" = COALESCE("highTime", 0)`,
                { transaction },
            );
            await queryInterface.sequelize.query(
                `UPDATE "settings"
                 SET "circleSize" = LEAST(125, GREATEST(25, COALESCE("circleSize", 100))),
                     "spawnInterval" = LEAST(2, GREATEST(0.25, ROUND(COALESCE("spawnInterval", 1)::numeric * 4) / 4)),
                     "shrinkTime" = LEAST(2, GREATEST(0.25, ROUND(COALESCE("shrinkTime", 1)::numeric * 4) / 4))`,
                { transaction },
            );
            await queryInterface.sequelize.query(
                `INSERT INTO "stats" ("userId", "totalGames", "highScore", "highTime", "createdAt", "updatedAt")
                 SELECT u."id", 0, 0, 0, NOW(), NOW()
                 FROM "user" AS u
                 WHERE NOT EXISTS (SELECT 1 FROM "stats" AS s WHERE s."userId" = u."id")`,
                { transaction },
            );
            await queryInterface.sequelize.query(
                `INSERT INTO "settings" ("userId", "circleSize", "spawnInterval", "shrinkTime", "createdAt", "updatedAt")
                 SELECT u."id", 100, 1, 1, NOW(), NOW()
                 FROM "user" AS u
                 WHERE NOT EXISTS (SELECT 1 FROM "settings" AS s WHERE s."userId" = u."id")`,
                { transaction },
            );
            await queryInterface.sequelize.query(
                `UPDATE "stats" AS s
                 SET "totalGames" = history."totalGames",
                     "highScore" = history."highScore",
                     "highTime" = history."highTime",
                     "updatedAt" = NOW()
                 FROM (
                     SELECT u."id" AS "userId",
                            COUNT(g."id")::integer AS "totalGames",
                            COALESCE(MAX(g."score"), 0) AS "highScore",
                            COALESCE(MAX(g."time"), 0) AS "highTime"
                     FROM "user" AS u
                     LEFT JOIN "game" AS g ON g."userId" = u."id"
                     GROUP BY u."id"
                 ) AS history
                 WHERE s."userId" = history."userId"`,
                { transaction },
            );

            for (const [column, type] of [
                ['totalGames', DataTypes.INTEGER],
                ['highScore', DataTypes.INTEGER],
                ['highTime', DataTypes.FLOAT],
            ]) {
                await queryInterface.changeColumn(
                    'stats',
                    column,
                    { type, allowNull: false, defaultValue: 0 },
                    { transaction },
                );
            }

            for (const [column, type, defaultValue] of [
                ['circleSize', DataTypes.INTEGER, 100],
                ['spawnInterval', DataTypes.FLOAT, 1],
                ['shrinkTime', DataTypes.FLOAT, 1],
            ]) {
                await queryInterface.changeColumn(
                    'settings',
                    column,
                    { type, allowNull: false, defaultValue },
                    { transaction },
                );
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            for (const table of dependentTables) {
                await removeUserForeignKeys(queryInterface, table, transaction);
                await queryInterface.sequelize.query(
                    `ALTER TABLE "${table}" ALTER COLUMN "userId" TYPE VARCHAR(255) USING "userId"::text`,
                    { transaction },
                );
            }

            await queryInterface.sequelize.query(
                `ALTER TABLE "game" ALTER COLUMN "userId" DROP NOT NULL;
                 ALTER TABLE "stats"
                     ALTER COLUMN "totalGames" DROP NOT NULL,
                     ALTER COLUMN "highScore" DROP NOT NULL,
                     ALTER COLUMN "highTime" DROP NOT NULL;
                 ALTER TABLE "settings"
                     ALTER COLUMN "circleSize" DROP NOT NULL,
                     ALTER COLUMN "spawnInterval" DROP NOT NULL,
                     ALTER COLUMN "shrinkTime" DROP NOT NULL`,
                { transaction },
            );
        });
    },
};
