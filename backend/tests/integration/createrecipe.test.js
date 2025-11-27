const request = require('supertest');
const app = require('../../app');
const sequelize = require('../../util/database');
const Recipe = require('../../models/recipe');
const User = require('../../models/user');

describe('POST /api/create-recipe', () => {

  let token;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // 1. Criar usuário
    await User.create({
      name: "Teste",
      email: "teste@teste.com",
      password: "123456"
    });

    // 2. Fazer login para obter token
    const login = await request(app)
      .post('/api/login')
      .send({ email: "teste@teste.com", password: "123456" });

    token = login.body.token; // ajuste se seu backend usa outro nome
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('Deve criar uma receita com sucesso', async () => {
    const recipeData = {
      title: 'Bolo de Chocolate',
      description: 'Um delicioso bolo',
      image: '/teste'
    };

    const response = await request(app)
      .post('/api/create-recipe')
      .set('Authorization', `Bearer ${token}`)   // ⬅ AQUI É O SEGREDO
      .send(recipeData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Bolo de Chocolate');

    const recipeInDb = await Recipe.findByPk(response.body.id);
    expect(recipeInDb).not.toBeNull();
  });

  test('Deve retornar erro 400 se faltarem campos obrigatórios', async () => {
    const response = await request(app)
      .post('/api/create-recipe')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Sem descrição' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

});
