const { DataTypes } = require('sequelize');
const timestampConfig = require('../src/db/timestamp.config');

const { UUID, UUIDV4, STRING } = DataTypes;

const userDTO = {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    username: {
        type: STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: STRING,
        allowNull: false,
    },
    ...timestampConfig.fields,
};

('use strict');
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable('user', userDTO);
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('user');
    },
};
