const request = require("supertest");
const app = require("../../app");
const { User, sequelize } = require("../../models");
const bcrypt = require("bcryptjs");

describe("POST /api/login", () => {
    //Limpando banco de dados
    beforeEach(async () => {
    await sequelize.sync({ force: true });


    //Criando usuário direto do banco
    await User.create({
        name: "Teste",
        email: "login@teste.com",
        password: await bcrypt.hash("123456", 12),
    });
    });

  
  it("deve fazer login com sucesso", async () => {
    //Utilizando método post em /api/login
    const res = await request(app)
      .post("/api/login")
      .send({
        email: "login@teste.com",
        password: "123456",
      });

    //Espera resposta 200
    expect(res.status).toBe(200);
    //Espera corpo.user.email com login@teste.com
    expect(res.body.user.email).toBe("login@teste.com");

    expect(res.headers["set-cookie"]).toBeDefined();

    const cookie = res.headers["set-cookie"][0];
    expect(cookie).toMatch(/connect.sid/);
  });
});
