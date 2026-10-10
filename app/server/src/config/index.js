const express = require('express');
const cookieParser = require('cookie-parser');
const { cors } = require('./cors.config.js');
const { helmet } = require('./helmet.config.js');
const { limiter, speedLimiter } = require('./limiters.config.js');
const jsonMiddleware = require('../middlewares/json.middleware.js');
const routes = require('../routes');

const config = [
    helmet,
    limiter,
    speedLimiter,
    cors,
    jsonMiddleware,
    express.json({ limit: '16kb' }),
    cookieParser(),
    express.urlencoded({
        extended: true,
        limit: '16kb',
    }),
    routes,
];

module.exports = config;
