const bcrypt = require('bcrypt');
const userRepository = require('../db/repositories/user.repository');
const statsRepository = require('../db/repositories/stats.repository');
const settingsRepository = require('../db/repositories/settings.repository');
const jwt = require('../util/jwt.util');
const { CREATED, UNAUTHORIZED, NOT_FOUND, UNPROCESSABLE_ENTITY } = require('../constants');

module.exports.checkAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'Not authenticated', id: null, username: null });
    }

    let decoded;
    try {
        decoded = jwt.verify(token);
    } catch {
        return res.json({ success: false, message: 'Authentication failed', id: null, username: null });
    }

    try {
        const userId = decoded.id;

        const user = await userRepository.getUserById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found', id: null, username: null });
        }

        const stats = await statsRepository.getStatsById(userId);
        const settings = await settingsRepository.getSettingsById(userId);
        return res.json({
            success: true,
            message: 'Authentication successful',
            id: user.id,
            username: user.username,
            stats,
            settings,
        });
    } catch (error) {
        return next(error);
    }
};

module.exports.post = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const user = await userRepository.createUser({ username: username.trim(), password: hash });

        const { id } = user;
        res.status(CREATED).send({ id, username: user.username });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(UNPROCESSABLE_ENTITY).json({ message: 'Username is already in use.' });
        }

        return next(error);
    }
};

module.exports.remove = async (req, res, next) => {
    try {
        const { id: userId } = req.context.user;
        await userRepository.deleteUser(userId);
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        let user = await userRepository.getUserWithPasswordByUsername(username);
        if (!user && username.trim() !== username) {
            user = await userRepository.getUserWithPasswordByUsername(username.trim());
        }
        if (!user) {
            res.status(NOT_FOUND).json({ message: "There isn't an account linked with that username." });
            return;
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            res.status(UNAUTHORIZED).json({ message: 'Your password was incorrect.' });
            return;
        }

        const token = jwt.sign({ id: user.id, username: user.username });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.send({ id: user.id, username: user.username });
    } catch (error) {
        next(error);
    }
};

module.exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 0,
    });
    res.json({ success: true, message: 'Logged out successfully' });
};
