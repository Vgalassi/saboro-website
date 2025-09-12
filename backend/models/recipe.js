const Sequelize = require('sequelize')
const sequelize = require('../util/database');

const Recipe = sequelize.define('recipe', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    image: {
       type: Sequelize.STRING,
       allowNull: true

    }

})

module.exports = Recipe