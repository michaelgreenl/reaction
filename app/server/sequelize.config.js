const dotenv = require('dotenv');
const environment = process.env.NODE_ENV || 'development';
dotenv.config({
    path: `.env.${environment}`,
});

const { POSTGRES_DATABASE, POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PORT = 5432 } = process.env;
module.exports = {
    database: POSTGRES_DATABASE,
    dialect: 'postgres',
    host: POSTGRES_HOST,
    port: Number(POSTGRES_PORT),
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    logging: false,
    dialectOptions:
        environment === 'production'
            ? {
                  ssl: {
                      require: true,
                      rejectUnauthorized: false,
                  },
              }
            : {},
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeSeedMeta',
};
