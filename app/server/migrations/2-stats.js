const { DataTypes } = require('sequelize');
const timestampConfig = require('../src/db/timestamp.config');

const { UUID, INTEGER, FLOAT } = DataTypes;

const statsDTO = {
    userId: {
        type: UUID,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    totalGames: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    highScore: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    highTime: {
        type: FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    ...timestampConfig.fields,
};

('use strict');
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable('stats', statsDTO);
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('stats');
    },
};
