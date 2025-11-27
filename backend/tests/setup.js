const { sequelize } = require("../models");

beforeAll(async () => {
  await sequelize.sync({ force: true }); // cria tabelas limpas
});

afterAll(async () => {
  await sequelize.close(); // evita “Cannot log after tests are done”
});
