const { DataTypes } = require('sequelize');
const timestampConfig = require('../src/db/timestamp.config');

const { UUID, INTEGER, FLOAT } = DataTypes;

const settingsDTO = {
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
    circleSize: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 100,
    },
    spawnInterval: {
        type: FLOAT,
        allowNull: false,
        defaultValue: 1.0,
    },
    shrinkTime: {
        type: FLOAT,
        allowNull: false,
        defaultValue: 1.0,
    },
    ...timestampConfig.fields,
};

('use strict');
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable('settings', settingsDTO);
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('settings');
    },
};
