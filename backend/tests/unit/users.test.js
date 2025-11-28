
const { register, login } = require("../../controllers/usersController.js");


const User = require("../../models/user.js");


const bcrypt = require("bcryptjs");


jest.mock("../../models/user");

// Transforma bcrypt em mock para controlar hash/compare nos testes
jest.mock("bcryptjs");

describe("Auth Controller Tests", () => {

  test("Register - deve criar usuário quando email NÃO existe", async () => {

    // Simula uma requisição 
    const req = {
      body: {
        email: "novo@teste.com",
        password: "123456",
        name: "Usuário Novo"
      }
    };

    // email ainda não existe
    User.findOne.mockResolvedValue(null);

    // Mock do hash da senha
    bcrypt.hash.mockResolvedValue("hashed_senha");

    // Mock do create, simulando criação no banco
    User.create.mockResolvedValue({
      id: 1,
      email: "novo@teste.com",
      name: "Usuário Novo",
      password: "hashed_senha"
    });

    // Res terá status e json
    const res = {
      status: jest.fn().mockReturnThis(), 
      json: jest.fn()
    };

    // Executado Register
    await register(req, res);

    // Verifica se buscou o email 
    expect(User.findOne).toHaveBeenCalledWith({ where: { email: "novo@teste.com" } });

    // Verifica se o hash foi gerado
    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 12);

    // Verifica se o usuário foi criado
    expect(User.create).toHaveBeenCalled();

    // Verifica resposta de sucesso
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

  //Register se email já existe
  test("Register - deve retornar erro se email já existe", async () => {

    // Simula uma requisição com email já cadastrado
    const req = {
      body: { email: "existe@teste.com", password: "abc", name: "X" }
    };

    // Retorna usuário 99
    User.findOne.mockResolvedValue({ id: 99 });

    // mock da resposta
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Executa controller
    await register(req, res);

    // Deve retornar erro
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "E-mail já cadastrado"
    });
  });

  // Testando Login
  test("Login - deve logar com email e senha corretos", async () => {

    // Simula requisição de login
    const req = {
      body: { email: "user@teste.com", password: "123" },
      session: {} 
    };

    // Usuário retornado pelo banco
    const fakeUser = {
      id: 10,
      email: "user@teste.com",
      name: "User Teste",
      password: "hashed_pass"
    };

    // FindOne irá retornar fakeUser
    User.findOne.mockResolvedValue(fakeUser);

    // Compara valor com true
    bcrypt.compare.mockResolvedValue(true);

    // Mock da resposta
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Executa o login
    await login(req, res);

    // Verifica que session foi populada
    expect(req.session.isLoggedIn).toBe(true);
    expect(req.session.user).toEqual(fakeUser);

    // Retorno esperado
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

  // Usuário não existe
  test("Login - deve falhar se usuário não existe", async () => {

    const req = { body: { email: "no@teste.com", password: "123" } };

    // findOne não encontrará usuário
    User.findOne.mockResolvedValue(null);

    //Resposta terá status e json
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await login(req, res);

    // Retorno esperado
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Usuário não encontrado"
    });
  });

  //
  test("Login - deve falhar se senha estiver incorreta", async () => {

    const req = { body: { email: "user@teste.com", password: "errada" } };

    // Mock: usuário existe
    User.findOne.mockResolvedValue({
      email: "user@teste.com",
      password: "hash"
    });

    // Compare vai gerar falso (senha não existe)
    bcrypt.compare.mockResolvedValue(false);

    //Resposta terá status e json
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await login(req, res);

    // Retorno esperado
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Senha incorreta"
    });
  });

});
