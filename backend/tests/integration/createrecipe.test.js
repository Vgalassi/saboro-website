const request = require('supertest');
const app = require('../../app');
const sequelize = require('../../util/database');
const Recipe = require('../../models/recipe.js');

describe('POST /recipes', () => {

  // Antes de qualquer teste, prepara um DB limpo
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // Após todos os testes, fecha a conexão
  afterAll(async () => {
    await sequelize.close();
  });

  test('Deve criar uma receita com sucesso', async () => {
    const recipeData = {
      title: 'Bolo de Chocolate',
      description: 'Um delicioso bolo',
      ingredients: 'farinha, leite, chocolate',
      steps: 'Misture tudo e asse'
    };

    const response = await request(app)
      .post('/recipes')
      .send(recipeData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Bolo de Chocolate');

    // Confere se salvou no banco
    const recipeInDb = await Recipe.findByPk(response.body.id);
    expect(recipeInDb).not.toBeNull();
    expect(recipeInDb.title).toBe('Bolo de Chocolate');
  });

  test('Deve retornar erro 400 se faltarem campos obrigatórios', async () => {
    const response = await request(app)
      .post('/recipes')
      .send({
        title: 'Sem descrição'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
