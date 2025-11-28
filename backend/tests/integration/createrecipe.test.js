const request = require("supertest");
const app = require("../../app");
const sequelize = require("../../util/database");
const Recipe = require("../../models/recipe");
const User = require("../../models/user");
const path = require("path"); // Importar 'path' para resolver o caminho do arquivo

// Caminho para uma imagem de teste (substitua pelo seu caminho real)
const TEST_IMAGE_PATH = path.resolve(__dirname, 'test-image.jpg'); 
// Certifique-se de que este arquivo existe para o teste funcionar!

describe("POST /api/create-recipe", () => {
  let agent; // mantém sessão

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    agent = request.agent(app);

    // 1. Registrar usuário
    await agent.post("/api/register").send({
      name: "Teste",
      email: "teste@teste.com",
      password: "123456",
    });

    // 2. Fazer login para criar sessão
    await agent.post("/api/login").send({
      email: "teste@teste.com",
      password: "123456",
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  // 👇 MUDANÇA PRINCIPAL AQUI: USAR .attach() E .field()
  test("Deve criar uma receita com sucesso, incluindo o upload da imagem", async () => {
    const recipeData = {
      title: "Bolo de Chocolate",
      description: "Um delicioso bolo",
      // O campo 'image' não é mais necessário aqui, ele será enviado via .attach()
    };

    // 3. Usar o mesmo agent (com sessão ativa)
    const response = await agent.post("/api/create-recipe")
      // Envia os campos de texto usando .field()
      .field('title', recipeData.title)
      .field('description', recipeData.description)
      // Envia o arquivo usando .attach(nomeDoCampo, caminhoDoArquivo)
      // O 'image' deve corresponder ao nome do campo de arquivo no seu middleware Multer
      .attach('image', TEST_IMAGE_PATH); 

    // O controller redireciona (301) em caso de sucesso.
    // É uma boa prática testar o status de redirecionamento.
    expect(response.status).toBe(302); // O controller faz um res.redirect('/'); que geralmente é 302/303

    // **Nota:** Como você está usando `res.redirect('/')`, `response.body` estará vazio
    // a menos que você configure o supertest para não seguir redirecionamentos.
    // O código original esperava 301 e `response.body.id`, o que é inconsistente com `res.redirect('/')`.
    // Vou comentar a verificação do ID no corpo, mas manter a verificação do DB.
    
    // Para realmente verificar se a receita foi criada, teríamos que buscar a última ou adaptar a resposta
    // No seu controller você pode mudar para `res.status(201).json({ recipe: result });` para retornar o ID.
    // Assumindo que você **modificará o controller** para retornar o objeto criado em vez de redirecionar:
    /*
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");

    const recipe = await Recipe.findByPk(response.body.id);
    expect(recipe).not.toBeNull();
    */

    // Teste alternativo para **confirmação de banco de dados** após o redirecionamento
    const recipes = await Recipe.findAll({ where: { title: recipeData.title } });
    expect(recipes.length).toBe(1);
    expect(recipes[0].image).toMatch(/\/images\/.+/); // Verifica se a URL da imagem foi salva

  });

  test("Deve retornar erro 400 se faltarem campos obrigatórios (incluindo a imagem)", async () => {
    // 1. Falta 'description' e 'image'
    const responseMissingFields = await agent.post("/api/create-recipe")
      .field('title', "Sem descrição"); 

    // Verifica erro de campo obrigatório (se for validado no backend antes do arquivo)
    // Se o middleware `multer` e a validação do `req.file` forem o primeiro check:
    expect(responseMissingFields.status).toBe(400); 
    expect(responseMissingFields.body).toHaveProperty("error", "Imagem inválida");
    
    // 2. Falta apenas o arquivo (image)
    const responseMissingImage = await agent.post("/api/create-recipe")
      .field('title', "Título")
      .field('description', "Descrição");
      // Não adiciona .attach('image', ...)

    expect(responseMissingImage.status).toBe(400);
    expect(responseMissingImage.body).toHaveProperty("error", "Imagem inválida");
  });
});