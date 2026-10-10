const { sequelize } = require('../sequelize-connection');
const { Settings, Stats, User } = require('../models');

const createUser = async ({ username, password }) =>
    sequelize.transaction(async (transaction) => {
        const user = await User.create({ username, password }, { transaction });
        await Stats.create({ userId: user.id }, { transaction });
        await Settings.create({ userId: user.id }, { transaction });
        return user;
    });

const deleteUser = async (userId) => User.destroy({ where: { id: userId } });

const getUserById = (userId) =>
    User.findOne({
        where: {
            id: userId,
        },
        attributes: {
            exclude: ['password'],
        },
    });

const getUserWithPasswordByUsername = (username) =>
    User.findOne({
        where: {
            username,
        },
    });

module.exports = {
    getUserById,
    getUserWithPasswordByUsername,
    createUser,
    deleteUser,
};
