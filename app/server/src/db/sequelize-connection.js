const Sequelize = require('sequelize');
const sequelizeConfig = require('../../sequelize.config.js');
const { database, host, port, username, password, dialect, dialectOptions, logging } = sequelizeConfig;

const sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect,
    dialectOptions,
    logging,
});

module.exports = { sequelize };
