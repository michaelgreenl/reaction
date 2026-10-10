const { Stats } = require('../models');

const getStatsById = (userId) =>
    Stats.findOne({
        where: {
            userId,
        },
        attributes: {
            exclude: ['userId', 'updatedAt', 'createdAt'],
            include: ['totalGames', 'highScore', 'highTime'],
        },
    });

module.exports = {
    getStatsById,
};
