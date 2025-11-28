const request = require("supertest");
const app = require("../../app");
const { User, sequelize } = require("../../models");

describe("POST /api/register", () => {
    //Limpa o banco de dados
    beforeEach(async () => {
    await sequelize.sync({ force: true });
    });


  it("deve registrar um usuário", async () => {
    //Envia post para app
    const res = await request(app)
      .post("/api/register")
      .send({
        name: "Teste",
        email: "teste@teste.com",
        password: "123456",
      });
    //Espera 201
    expect(res.status).toBe(201);
    ///Espera que corpo da resposta.user.email seja o email
    expect(res.body.user.email).toBe("teste@teste.com");

    //Verifica se usuário foi salvo no banco
    const user = await User.findOne({ where: { email: "teste@teste.com" }});
    expect(user).not.toBeNull();
  });
});
