const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../sequelize-connection');
const timestampConfig = require('../timestamp.config');

const { UUID, INTEGER, FLOAT } = DataTypes;

class Stats extends Model {}

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
        validate: { isUUID: 4 },
    },
    totalGames: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
    },
    highScore: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
    },
    highTime: {
        type: FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
    },
    ...timestampConfig.fields,
};

Stats.init(statsDTO, {
    ...timestampConfig.tableOptions,
    sequelize,
    tableName: 'stats',
});

const applyAssociations = (models) => {
    const { User } = models;

    Stats.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
};

module.exports = {
    model: Stats,
    statsDTO,
    applyAssociations,
};
