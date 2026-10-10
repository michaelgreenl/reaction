const { sequelize } = require('../sequelize-connection.js');
const { Op } = require('sequelize');
const { Game, Stats } = require('../models');

const createGame = async ({ userId, score, time, settings }) =>
    sequelize.transaction(async (transaction) => {
        const stats = await Stats.findOne({
            where: { userId },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });
        if (!stats) {
            const error = new Error('Stats not found');
            error.status = 404;
            throw error;
        }

        const nextStats = {
            totalGames: stats.totalGames + 1,
            highScore: Math.max(score, stats.highScore),
            highTime: Math.max(time, stats.highTime),
        };

        await Game.create({ userId, score, time, settings }, { transaction });
        await Stats.update(nextStats, { where: { userId }, transaction });

        return nextStats;
    });

const getGamesBySetting = async ({ userId, limit, offset, filters, sortedBy, sortedOrder }) => {
    const conditions = [{ userId }];

    for (const filter of filters) {
        conditions.push({
            settings: {
                [filter.filter]: filter.value,
            },
        });
    }

    return Game.findAll({
        where: { [Op.and]: conditions },
        order: [
            [sortedBy, sortedOrder],
            ['id', sortedOrder],
        ],
        attributes: {
            include: ['score', 'time', 'settings', 'createdAt'],
            exclude: ['id', 'userId', 'updatedAt'],
        },
        limit,
        offset,
    });
};

const getAllGames = async ({ userId, limit, offset, sortedBy, sortedOrder }) =>
    Game.findAll({
        where: {
            userId,
        },
        order: [
            [sortedBy, sortedOrder],
            ['id', sortedOrder],
        ],
        attributes: {
            include: ['score', 'time', 'settings', 'createdAt'],
            exclude: ['id', 'userId', 'updatedAt'],
        },
        limit,
        offset,
    });

const deleteGames = async (userId) => Game.destroy({ where: { userId } });

const deleteGamesAndResetStats = async (userId) =>
    sequelize.transaction(async (transaction) => {
        const stats = await Stats.findOne({
            where: { userId },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });
        if (!stats) {
            const error = new Error('Stats not found');
            error.status = 404;
            throw error;
        }

        await Game.destroy({ where: { userId }, transaction });
        await Stats.update(
            { totalGames: 0, highScore: 0, highTime: 0 },
            {
                where: { userId },
                transaction,
            },
        );
    });

module.exports = {
    getAllGames,
    getGamesBySetting,
    createGame,
    deleteGames,
    deleteGamesAndResetStats,
};
