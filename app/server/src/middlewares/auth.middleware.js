const jwt = require('../util/jwt.util');
const { UNAUTHORIZED } = require('../constants');

module.exports.jwt = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(UNAUTHORIZED).json({ message: 'Missing token' });
    }

    try {
        req.context = {
            ...req.context,
            user: jwt.verify(token),
        };

        next();
    } catch {
        return res.status(UNAUTHORIZED).json({ message: 'Unauthorized' });
    }
};
