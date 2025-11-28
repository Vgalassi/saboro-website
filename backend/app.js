// app.js
const path = require('path');
const express = require('express');
const sequelize = require('./util/database.js');
// Remover: const multer = require('multer'); // Não precisamos dele aqui
const recipesRouter = require('./routes/recipes.js');
const usersRouter = require('./routes/users.js');
const Recipe = require('./models/recipe');
const User = require('./models/user');
const session = require('express-session');
const cors = require('cors');

const app = express();

app.use("/images", express.static(path.join(process.cwd(), "images")));

// Os middlewares de processamento de corpo (JSON) e CORS devem vir antes das rotas
app.use(cors());
app.use(express.json()); 
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false }));

// Rota para outros endpoints (login, register, etc.)
app.use(usersRouter);

// Rota para receitas, onde a lógica do Multer será aplicada
app.use(recipesRouter); 

// Remover: app.use(multer({ storage: fileStorage, fileFilter }).single('image')); 
// As configurações do Multer foram movidas para 'routes.js'

// relacionamentos
Recipe.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE'
});


module.exports = app;