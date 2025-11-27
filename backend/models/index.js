const sequelize = require("../util/database");

const User = require("./user");
const Recipe = require("./recipe");

module.exports = {
  sequelize,
  User,
  Recipe
};
