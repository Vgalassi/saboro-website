const request = require("supertest");
const app = require("../../app");
const { User, Recipe, sequelize } = require("../../models");
const bcrypt = require("bcryptjs");

describe("POST /recipes/create", () => {
  let agent;

  beforeEach(async () => {
    await sequelize.truncate({ cascade: true });

    agent = request.agent(app);

    await User.create({
      name: "User Test",
      email: "recipe@teste.com",
      password: await bcrypt.hash("123456", 12),
    });

    await agent.post("/auth/login").send({
      email: "recipe@teste.com",
      password: "123456",
    });
  });

  it("deve criar uma receita autenticado", async () => {
    const res = await agent
      .post("/recipes/create")
      .field("title", "Minha Receita")
      .field("description", "Descrição teste")
      .attach("image", "__tests__/files/test.jpg");

    expect(res.status).toBe(302);
  });
});
