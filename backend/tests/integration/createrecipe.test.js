const request = require("supertest");
const app = require("../../app");
const sequelize = require("../../util/database");

describe("POST /api/create-recipe", () => {
  let agent;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    agent = request.agent(app);

    // Cria usuário
    await agent.post("/api/register").send({
      name: "Teste",
      email: "teste@teste.com",
      password: "123456",
    });

    // Faz login (mantém cookie na sessão)
    await agent.post("/api/login").send({
      email: "teste@teste.com",
      password: "123456",
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("Deve criar receita com sucesso", async () => {
    const response = await agent
      .post("/api/create-recipe")
      .field("title", "Bolo de Chocolate")
      .field("description", "Um delicioso bolo")
      .attach("image", Buffer.from("fake image"), "foto.png");

    // O controller faz res.redirect("/")
    expect(response.status).toBe(302);
    expect(response.header.location).toBe("/");
  });

  test("Deve retornar erro 400 se faltarem campos obrigatórios", async () => {
    const response = await agent
      .post("/api/create-recipe")
      .field("title", "Bolo sem descrição");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
