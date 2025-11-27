const { register, login } = require("../../controllers/usersController.js");
const User = require("../../models/user.js");
const bcrypt = require("bcryptjs");

jest.mock("../../models/user");
jest.mock("bcryptjs");

describe("Auth Controller Tests", () => {

  // ---------------------------
  //       REGISTER TESTS
  // ---------------------------

  test("Register - deve criar usuário quando email NÃO existe", async () => {

    const req = {
      body: {
        email: "novo@teste.com",
        password: "123456",
        name: "Usuário Novo"
      }
    };

    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed_senha");

    User.create.mockResolvedValue({
      id: 1,
      email: "novo@teste.com",
      name: "Usuário Novo",
      password: "hashed_senha"
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await register(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: "novo@teste.com" } });
    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 12);
    expect(User.create).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuário registrado com sucesso!",
      user: {
        id: 1,
        name: "Usuário Novo",
        email: "novo@teste.com",
      },
    });
  });

  test("Register - deve retornar erro se email já existe", async () => {
    const req = {
      body: { email: "existe@teste.com", password: "abc", name: "X" }
    };

    User.findOne.mockResolvedValue({ id: 99 });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "E-mail já cadastrado"
    });
  });

  // ---------------------------
  //          LOGIN TESTS
  // ---------------------------

  test("Login - deve logar com email e senha corretos", async () => {

    const req = {
      body: { email: "user@teste.com", password: "123" },
      session: {}
    };

    const fakeUser = {
      id: 10,
      email: "user@teste.com",
      name: "User Teste",
      password: "hashed_pass"
    };

    User.findOne.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await login(req, res);

    expect(req.session.isLoggedIn).toBe(true);
    expect(req.session.user).toEqual(fakeUser);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login realizado com sucesso!",
      user: {
        id: 10,
        name: "User Teste",
        email: "user@teste.com"
      },
    });
  });

  test("Login - deve falhar se usuário não existe", async () => {

    const req = { body: { email: "no@teste.com", password: "123" } };

    User.findOne.mockResolvedValue(null);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Usuário não encontrado"
    });
  });

  test("Login - deve falhar se senha estiver incorreta", async () => {

    const req = { body: { email: "user@teste.com", password: "errada" } };

    User.findOne.mockResolvedValue({
      email: "user@teste.com",
      password: "hash"
    });

    bcrypt.compare.mockResolvedValue(false);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Senha incorreta"
    });
  });

});
