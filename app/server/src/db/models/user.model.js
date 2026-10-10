const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../sequelize-connection');
const timestampConfig = require('../timestamp.config');

const { UUID, UUIDV4, STRING } = DataTypes;

class User extends Model {}

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
        validate: { notEmpty: true, len: [3, 30] },
    },
    password: {
        type: STRING,
        allowNull: false,
    },
    ...timestampConfig.fields,
};

User.init(userDTO, {
    ...timestampConfig.tableOptions,
    sequelize,
    tableName: 'user',
});

const applyAssociations = (models) => {
    const { Settings, Stats, Game } = models;

    User.hasOne(Settings, { foreignKey: 'userId', onDelete: 'CASCADE' });
    User.hasOne(Stats, { foreignKey: 'userId', onDelete: 'CASCADE' });
    User.hasMany(Game, { foreignKey: 'userId', onDelete: 'CASCADE' });
};

module.exports = {
    model: User,
    userDTO,
    applyAssociations,
};
