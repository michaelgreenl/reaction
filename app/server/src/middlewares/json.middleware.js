const { UNPROCESSABLE_ENTITY } = require('../constants');

module.exports = (req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const contentType = req.headers['content-type'];

        if (!contentType || !contentType.includes('application/json')) {
            return res.status(UNPROCESSABLE_ENTITY).json({
                message: 'Content-Type must be application/json',
            });
        }
    }
    next();
};
