const request = require("supertest");
const app = require("../../app");
const sequelize = require("../../util/database");
const Recipe = require("../../models/recipe");
const User = require("../../models/user");

describe("POST /api/create-recipe", () => {
  let agent;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    agent = request.agent(app);

    // Registrar usuário
    await agent.post("/api/register").send({
      name: "Teste",
      email: "teste@teste.com",
      password: "123456",
    });

    // Login para criar sessão
    await agent.post("/api/login").send({
      email: "teste@teste.com",
      password: "123456",
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("Deve editar uma receita com sucesso", async () => {
    // Criar receita diretamente no banco
    const recipe = await Recipe.create({
      title: "Velho",
      description: "Descrição antiga",
      image: "/img.png",
      userId: 1,
    });

    // Dados para edição
    const updatedData = {
      title: "Novo título",
      description: "Nova descrição",
      image: "/novo.png",
    };

    const response = await agent
      .post(`/api/edit-recipe/${recipe.id}`)
      .send(updatedData);

    // Se controller usa redirect
    expect(response.status).toBe(302);

    // Verificar se foi atualizado no banco
    const updated = await Recipe.findByPk(recipe.id);

    expect(updated.title).toBe("Novo título");
    expect(updated.description).toBe("Nova descrição");
  });
});
