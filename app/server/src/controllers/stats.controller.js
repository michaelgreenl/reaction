const statsRepository = require('../db/repositories/stats.repository');

module.exports.get = async (req, res, next) => {
    try {
        const { id: userId } = req.context.user;
        const stats = await statsRepository.getStatsById(userId);
        res.send(stats);
    } catch (error) {
        next(error);
    }
};
