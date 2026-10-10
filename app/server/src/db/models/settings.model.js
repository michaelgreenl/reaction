const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../sequelize-connection');
const timestampConfig = require('../timestamp.config');

const { UUID, INTEGER, FLOAT } = DataTypes;

class Settings extends Model {}

const quarterSecond = (value) => {
    if (!Number.isInteger(value * 4)) throw new Error('Must use quarter-second steps');
};

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
        validate: { isUUID: 4 },
    },
    circleSize: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 100,
        validate: { min: 25, max: 125 },
    },
    spawnInterval: {
        type: FLOAT,
        allowNull: false,
        defaultValue: 1.0,
        validate: { min: 0.25, max: 2, quarterSecond },
    },
    shrinkTime: {
        type: FLOAT,
        allowNull: false,
        defaultValue: 1.0,
        validate: { min: 0.25, max: 2, quarterSecond },
    },
    ...timestampConfig.fields,
};

Settings.init(settingsDTO, {
    ...timestampConfig.tableOptions,
    sequelize,
    tableName: 'settings',
});

const applyAssociations = (models) => {
    const { User } = models;

    Settings.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
};

module.exports = {
    model: Settings,
    settingsDTO,
    applyAssociations,
};
