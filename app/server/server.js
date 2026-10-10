const dotenv = require('dotenv');
const environment = process.env.NODE_ENV || 'development';
dotenv.config({
    path: `.env.${environment}`,
});

for (const name of [
    'FRONTEND_URL',
    'JWT_SECRET',
    'POSTGRES_DATABASE',
    'POSTGRES_HOST',
    'POSTGRES_PASSWORD',
    'POSTGRES_USER',
]) {
    if (!process.env[name]) throw new Error(`Missing required environment variable: ${name}`);
}

const app = require('./src/app');
const db = require('./src/db/models/index.js');

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';
db.sequelize
    .authenticate()
    .then(() => {
        app.listen(PORT, HOST);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
