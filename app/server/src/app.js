const express = require('express');
const config = require('./config');
const { sequelize } = require('./db/sequelize-connection');
const { NOT_FOUND, SERVER_ERROR, SERVICE_UNAVAILABLE } = require('./constants');

const app = express();

if (process.env.RENDER) {
    app.set('trust proxy', 1);
}

app.get('/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({ status: 'ok' });
    } catch {
        res.status(SERVICE_UNAVAILABLE).json({ status: 'unavailable' });
    }
});

app.use(config);

app.use((req, res) => res.status(NOT_FOUND).json({ message: 'Not found' }));

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({ message: 'Invalid JSON' });
    }

    console.error(error);
    return res
        .status(error.status || SERVER_ERROR)
        .json({ message: error.status ? error.message : 'Internal server error' });
});

module.exports = app;
