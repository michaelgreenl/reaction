const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../sequelize-connection');
const timestampConfig = require('../timestamp.config');

const { UUID, UUIDV4, INTEGER, FLOAT, JSONB } = DataTypes;

class Game extends Model {}

const gameDTO = {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: UUID,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id',
        },
        onDelete: 'CASCADE',
        validate: { isUUID: 4 },
    },
    score: {
        type: INTEGER,
        allowNull: false,
        validate: { min: 0, max: 2_147_483_647 },
    },
    time: {
        type: FLOAT,
        allowNull: false,
        validate: { min: 0 },
    },
    settings: {
        type: JSONB,
        allowNull: false,
    },
    ...timestampConfig.fields,
};

Game.init(gameDTO, {
    ...timestampConfig.tableOptions,
    sequelize,
    tableName: 'game',
});

const applyAssociations = (models) => {
    const { User } = models;

    Game.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
};

module.exports = {
    model: Game,
    gameDTO,
    applyAssociations,
};
