
const Sequelize = require('sequelize');


const dbName = process.env.DB_NAME || 'saboro';
const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASS || 'root';
const dbHost = process.env.DB_HOST || '192.168.100.20'; 
const sequelize = new Sequelize(dbName, dbUser, dbPass,
    {
        dialect: 'mysql',
        host: dbHost
    }
)
module.exports = sequelize;