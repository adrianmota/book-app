const { Sequelize } = require('sequelize');

require('dotenv').config({ path: `${require.main.path}/.env` });

const sequelize = new Sequelize('bookapp', process.env.USER, process.env.PASSWORD, {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

module.exports = sequelize;