// routes/recipes.js
const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController.js');

// --- Importações e Configuração do Multer ---
const multer = require('multer');
const path = require('path'); 

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    const safeName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, safeName);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Configuração para processar um único arquivo no campo 'image'
const upload = multer({ storage: fileStorage, fileFilter }).single('image');
// --- Fim Configuração do Multer ---


router.get('/api', recipesController.getIndexRecipes);

// 🔑 CORREÇÃO: Aplicar o middleware 'upload' (Multer) diretamente na rota
router.post('/api/create-recipe', upload, recipesController.createRecipe); 

router.get('/api/find-recipe/:recipeId',recipesController.fetchRecipe);

router.post('/api/edit-recipe/:recipeId',recipesController.editRecipe);

router.post('/api/delete-recipe/:recipeId',recipesController.deleteRecipe);

router.get('/api/recipes-by-user',recipesController.recipeByUser);

router.get('/api/find-recipe-user/:recipeId',recipesController.fetchRecipeWithUser);


module.exports = router;