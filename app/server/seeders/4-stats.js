('use strict');

// Compute stats from seeded games for each user
module.exports = {
    async up(queryInterface) {
        const [users] = await queryInterface.sequelize.query('SELECT id FROM "user";');
        const [games] = await queryInterface.sequelize.query('SELECT "userId", score, time FROM game;');
        const now = new Date();

        const grouped = new Map();
        for (const g of games) {
            const arr = grouped.get(g.userId) || [];
            arr.push(g);
            grouped.set(g.userId, arr);
        }

        const rows = [];
        for (const u of users) {
            const userGames = grouped.get(u.id) || [];
            const totalGames = userGames.length;
            const highScore = userGames.reduce((m, g) => Math.max(m, g.score), 0);
            const highTime = Number(userGames.reduce((m, g) => Math.max(m, g.time), 0).toFixed(2));
            rows.push({ userId: u.id, totalGames, highScore, highTime, createdAt: now, updatedAt: now });
        }

        await queryInterface.bulkInsert('stats', rows, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('stats', {}, {});
    },
};
