const { getIndexRecipes, createRecipe } = require('../../controllers/recipesController.js');
const Recipe = require('../../models/recipe.js');

// mock do modelo
jest.mock('../../models/recipe');

describe("Recipe controller", () => {

  test("getIndexRecipes deve retornar lista de receitas", async () => {
    const mockRecipes = [
      { id: 1, title: "Bolo" },
      { id: 2, title: "Torta" }
    ];

    // mock do Sequelize findAll()
    Recipe.findAll.mockResolvedValue(mockRecipes);

    // mock de req e res
    const req = {};
    const res = {
      json: jest.fn()
    };

    await getIndexRecipes(req, res);

    expect(Recipe.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockRecipes);
  });

});

test("createRecipe deve retornar 401 se usuário não estiver logado", async () => {
  const req = {
    session: { isLoggedIn: false }
  };
  
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await createRecipe(req, res);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ error: "Usuário não autenticado" });
});


test("createRecipe retorna 400 se não enviar imagem", async () => {
  const req = {
    session: { isLoggedIn: true, user: { id: 1 }},
    body: { title: "Teste", description: "Desc" },
    file: null
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await createRecipe(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: "Imagem inválida" });
});


test("createRecipe cria receita quando tudo está OK", async () => {
  Recipe.create.mockResolvedValue({ id: 123 });

  const req = {
    session: { isLoggedIn: true, user: { id: 1 }},
    body: { title: "Nova", description: "Teste" },
    file: { filename: "foto.jpg" }
  };

  const res = {
    redirect: jest.fn()
  };

  await createRecipe(req, res);

  expect(Recipe.create).toHaveBeenCalledWith({
    title: "Nova",
    description: "Teste",
    image: "/images/foto.jpg",
    userId: 1
  });

  expect(res.redirect).toHaveBeenCalledWith("/");
});
