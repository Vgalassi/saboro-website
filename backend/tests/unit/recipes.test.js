
const { getIndexRecipes, createRecipe } = require('../../controllers/recipesController.js');


const Recipe = require('../../models/recipe.js');


jest.mock('../../models/recipe');


//Testando getIndexRecipes
describe("Recipe controller", () => {

  test("getIndexRecipes deve retornar lista de receitas", async () => {

    //criando receitas mock
    const mockRecipes = [
      { id: 1, title: "Bolo" },
      { id: 2, title: "Torta" }
    ];

    // Define que Recipe.findAll deve retornar a lista acima
    Recipe.findAll.mockResolvedValue(mockRecipes);

    // Mocks  do req e res
    const req = {};
    const res = {
      json: jest.fn() 
    };

    // Executa a função
    await getIndexRecipes(req, res);

    // Confere se findAll foi chamado
    expect(Recipe.findAll).toHaveBeenCalled();

    // Confere se a resposta foi enviada corretamente
    expect(res.json).toHaveBeenCalledWith(mockRecipes);
  });

});


//Testando create recipe sem logar
test("createRecipe deve retornar 401 se usuário não estiver logado", async () => {
  const req = {
    session: { isLoggedIn: false } // usuário não logado
  };
  
  const res = {
    status: jest.fn().mockReturnThis(), 
    json: jest.fn()
  };

  await createRecipe(req, res);

  //Espera erro 401
  expect(res.status).toHaveBeenCalledWith(401);

  // Verifica mensagem de erro enviada
  expect(res.json).toHaveBeenCalledWith({ error: "Usuário não autenticado" });
});



//Testando create sem retornar imagem
test("createRecipe retorna 400 se não enviar imagem", async () => {
  const req = {
    session: { isLoggedIn: true, user: { id: 1 }}, // usuário logado
    body: { title: "Teste", description: "Desc" },
    file: null 
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await createRecipe(req, res);

  // Verifica erro 400 por falta de imagem
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: "Imagem inválida" });
});
//oi

test("createRecipe cria receita quando tudo está OK", async () => {

  // Mock da criação no banco
  Recipe.create.mockResolvedValue({ id: 123 });

  const req = {
    session: { isLoggedIn: true, user: { id: 1 }},
    body: { title: "Nova", description: "Teste" },
    file: { filename: "foto.jpg" } // imagem enviada
  };

  const res = {
    redirect: jest.fn() // mock para interceptar redirecionamento
  };

  // Executa função
  await createRecipe(req, res);

  // Verifica se Recipe.create foi chamado com os valores esperados
  expect(Recipe.create).toHaveBeenCalledWith({
    title: "Nova",
    description: "Teste",
    image: "/images/foto.jpg",
    userId: 1
  });

  // Verifica redirecionamento após sucesso
  expect(res.redirect).toHaveBeenCalledWith("/");
});
