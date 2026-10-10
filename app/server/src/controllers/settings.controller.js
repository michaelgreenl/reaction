const settingsRepository = require('../db/repositories/settings.repository');

module.exports.get = async (req, res, next) => {
    try {
        const { id: userId } = req.context.user;
        const settings = await settingsRepository.getSettingsById(userId);
        res.json(settings);
    } catch (error) {
        next(error);
    }
};

module.exports.put = async (req, res, next) => {
    try {
        const { id: userId } = req.context.user;
        const { circleSize, spawnInterval, shrinkTime } = req.body;
        await settingsRepository.updateSettings({
            userId,
            circleSize,
            spawnInterval,
            shrinkTime,
        });
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
};
