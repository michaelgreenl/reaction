('use strict');

const { v4: uuidv4 } = require('uuid');

module.exports = {
    async up(queryInterface) {
        const [users] = await queryInterface.sequelize.query('SELECT id FROM "user";');
        const [settings] = await queryInterface.sequelize.query('SELECT * FROM settings;');

        const userIdToSettings = new Map(settings.map((s) => [s.userId, s]));
        const now = new Date();

        const games = [];
        for (const u of users) {
            const userSettings = userIdToSettings.get(u.id);

            for (let i = 0; i < 15; i++) {
                const baseScore = 20 + Math.floor(Math.random() * 30);
                const baseTime = 10_000 + Math.random() * 20_000;

                const csFactor = 100 / (userSettings?.circleSize ?? 100);
                const spFactor = 1.0 / (userSettings?.spawnInterval ?? 1.0);
                const shFactor = 1.0 / (userSettings?.shrinkTime ?? 1.0);

                const difficultyBoost = (csFactor + spFactor + shFactor) / 3;
                const score = Math.round(baseScore * difficultyBoost + Math.random() * 10);
                const time = parseFloat((baseTime * (1 + Math.random() * 0.2 - 0.1)).toFixed(2));

                const useDefault = i % 2 === 0;
                const gameSettings = useDefault
                    ? { circleSize: 100, spawnInterval: 1.0, shrinkTime: 1.0 }
                    : {
                          circleSize: userSettings?.circleSize ?? 100,
                          spawnInterval: userSettings?.spawnInterval ?? 1.0,
                          shrinkTime: userSettings?.shrinkTime ?? 1.0,
                      };

                games.push({
                    id: uuidv4(),
                    userId: u.id,
                    score,
                    time,
                    settings: JSON.stringify(gameSettings),
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        await queryInterface.bulkInsert('game', games, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('game', {}, {});
    },
};
