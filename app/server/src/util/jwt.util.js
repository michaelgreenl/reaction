const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

module.exports = {
    sign: (obj = {}) =>
        jwt.sign(obj, JWT_SECRET, {
            expiresIn: 60 * 60 * 24, // 24 hours
            issuer: 'reaction-api',
            audience: 'reaction-client',
        }),
    verify: (token) =>
        jwt.verify(token, JWT_SECRET, {
            issuer: 'reaction-api',
            audience: 'reaction-client',
        }),
};
