('use strict');

const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

async function buildUsers(count) {
    const passwordHash = await bcrypt.hash('password123', 10);
    const now = new Date();
    const users = [];
    for (let i = 1; i <= count; i++) {
        users.push({
            id: uuidv4(),
            username: `username${i}`,
            password: passwordHash,
            createdAt: now,
            updatedAt: now,
        });
    }
    return users;
}

module.exports = {
    async up(queryInterface) {
        const users = await buildUsers(10);
        await queryInterface.bulkInsert('user', users, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete(
            'user',
            {
                username: {
                    [Op.like]: 'username%',
                },
            },
            {},
        );
    },
};
