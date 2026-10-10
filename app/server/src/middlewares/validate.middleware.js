const { BAD_REQUEST } = require('../constants');

module.exports = (schema) => (req, res, next) => {
    const message = schema(req);
    return message ? res.status(BAD_REQUEST).json({ message }) : next();
};
