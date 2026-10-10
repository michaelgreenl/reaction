const express = require('express');
const rateLimit = require('express-rate-limit');
const { post, remove, login, logout, checkAuth } = require('../controllers/user.controller');
const { jwt } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const schemas = require('../request.schemas');

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs for an IP
    message: { message: 'Too many authentication attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.get('/check-auth', checkAuth);

router.post('/login', authLimiter, validate(schemas.loginCredentials), login);

router.delete('/:userId', jwt, remove);

router.post('/auth', authLimiter, validate(schemas.credentials), post);

router.post('/logout', logout);

module.exports = router;
