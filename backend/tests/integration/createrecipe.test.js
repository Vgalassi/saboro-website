const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user.js");
const Recipe = require("../../models/recipe.js");
const bcrypt = require("bcryptjs");

describe("POST /recipes/create", () => {
  let agent;
  let user;

  beforeAll(async () => {
    agent = request.agent(app);

    await Recipe.destroy({ where: {} });
    await User.destroy({ where: {} });

    user = await User.create({
      name: "User Test",
      email: "recipe@teste.com",
      password: await bcrypt.hash("123456", 12),
    });

    // Login para criar sessão
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

    expect(res.status).toBe(302); // redireciona para /
  });
});
