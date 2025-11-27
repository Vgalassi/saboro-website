const request = require("supertest");
const app = require("../../app");
const sequelize = require("../../util/database");
const Recipe = require("../../models/recipe");
const User = require("../../models/user");

describe("POST /api/create-recipe", () => {
  let agent; // mantém sessão

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    agent = request.agent(app);

    // 1. Registrar usuário
    await agent.post("/api/register").send({
      name: "Teste",
      email: "teste@teste.com",
      password: "123456",
    });

    // 2. Fazer login para criar sessão
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

    expect(response.status).toBe(302); // redireciona para '/'
  });


  test("Deve retornar erro 400 se faltarem campos obrigatórios", async () => {
    const response = await agent.post("/api/create-recipe").send({
      title: "Sem descrição",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
