const request = require("supertest");
const app = require("../../app");
const { User, sequelize } = require("../../models");

describe("POST /api/register", () => {
    beforeEach(async () => {
    await sequelize.sync({ force: true });
    });

  it("deve registrar um usuário", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({
        name: "Teste",
        email: "teste@teste.com",
        password: "123456",
      });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("teste@teste.com");

    const user = await User.findOne({ where: { email: "teste@teste.com" }});
    expect(user).not.toBeNull();
  });
});
