const Config = require('../config/Database');
const Sequelize = require('sequelize');

const MySQLSequelize = new Sequelize(
    Config.mysql.database,
    Config.mysql.username,
    Config.mysql.password, {
        host: Config.mysql.host,
        port: Config.mysql.port,
        dialect: Config.mysql.dialect,
        logging: false
    }
);

module.exports = MySQLSequelize;