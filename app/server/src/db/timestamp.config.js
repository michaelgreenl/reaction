const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
    fields: {
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.fn('NOW'),
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.fn('NOW'),
        },
    },
    tableOptions: {
        timestamps: true,
    },
};
