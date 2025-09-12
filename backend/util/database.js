const Sequelize = require('sequelize');

const sequelize = new Sequelize('saboro','root','root',
    {
        dialect: 'mysql',
        host: '192.168.100.20'
    }
)


module.exports = sequelize;