const gameRepository = require('../db/repositories/game.repository');
const { CREATED } = require('../constants');

module.exports.post = async (req, res, next) => {
    const { id: userId } = req.context.user;
    const { score, time, settings } = req.body;

    try {
        const stats = await gameRepository.createGame({
            userId,
            score,
            time,
            settings,
        });
        res.status(CREATED).send(stats);
    } catch (error) {
        next(error);
    }
};

module.exports.get = async (req, res, next) => {
    try {
        const { id: userId } = req.context.user;
        const { limit, offset, sortedBy, sortedOrder } = req.validatedQuery;
        const games = await gameRepository.getAllGames({ userId, limit, offset, sortedBy, sortedOrder });
        res.send({ games });
    } catch (error) {
        next(error);
    }
};

module.exports.getGamesBySetting = async (req, res, next) => {
    try {
        const { id: userId } = req.context.user;
        const { limit, offset, sortedBy, sortedOrder } = req.validatedQuery;

        const games = await gameRepository.getGamesBySetting({
            userId,
            limit,
            offset,
            filters: req.validatedFilters,
            sortedBy,
            sortedOrder,
        });
        res.send({ games });
    } catch (error) {
        next(error);
    }
};

module.exports.remove = async (req, res, next) => {
    try {
        const { id: userId } = req.context.user;
        await gameRepository.deleteGamesAndResetStats(userId);
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
};
