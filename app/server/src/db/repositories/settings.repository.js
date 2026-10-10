const { Settings } = require('../models');

const getSettingsById = async (userId) =>
    Settings.findOne({
        where: {
            userId,
        },
        attributes: {
            include: ['circleSize', 'spawnInterval', 'shrinkTime'],
            exclude: ['id', 'userId', 'updatedAt', 'createdAt'],
        },
    });

const updateSettings = async ({ userId, circleSize, spawnInterval, shrinkTime }) =>
    Settings.update(
        {
            circleSize,
            spawnInterval,
            shrinkTime,
        },
        {
            where: {
                userId,
            },
        },
    );

module.exports = {
    getSettingsById,
    updateSettings,
};
