const request = require("supertest");
const app = require("../../app");
const { User, sequelize } = require("../../models");
const bcrypt = require("bcryptjs");

describe("POST /auth/login", () => {
    beforeEach(async () => {
    await sequelize.sync({ force: true });

    await User.create({
        name: "Teste",
        email: "login@teste.com",
        password: await bcrypt.hash("123456", 12),
    });
    });

  it("deve fazer login com sucesso", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "login@teste.com",
        password: "123456",
      });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("login@teste.com");
  });
});
