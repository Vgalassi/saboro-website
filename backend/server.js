const app = require('./app');
const sequelize = require('./util/database');

sequelize.sync().then(() => {
  app.listen(3001, () => console.log("Server running on 3001"));
});
