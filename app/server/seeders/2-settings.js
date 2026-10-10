('use strict');

// Create default settings rows for each user; vary one field for some
module.exports = {
    async up(queryInterface) {
        const [users] = await queryInterface.sequelize.query('SELECT id FROM "user";');
        const now = new Date();

        const settingsRows = users.map((u, idx) => {
            let circleSize = 100;
            let spawnInterval = 1.0;
            let shrinkTime = 1.0;

            const mod = (idx + 1) % 3;
            if (mod === 1) circleSize = 80; // smaller targets
            if (mod === 2) spawnInterval = 0.75; // faster spawns
            if (mod === 0) shrinkTime = 0.75; // quicker shrink

            return {
                userId: u.id,
                circleSize,
                spawnInterval,
                shrinkTime,
                createdAt: now,
                updatedAt: now,
            };
        });

        await queryInterface.bulkInsert('settings', settingsRows, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('settings', {}, {});
    },
};
