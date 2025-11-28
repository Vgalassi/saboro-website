const express = require('express');
const router = express.Router();

const recipesController = require('../controllers/recipesController.js')

router.get('/api', recipesController.getIndexRecipes);

router.post('/api/create-recipe', recipesController.createRecipe);

router.get('/api/find-recipe/:recipeId',recipesController.fetchRecipe);

router.post('/api/edit-recipe/:recipeId',recipesController.editRecipe);

router.post('/api/delete-recipe/:recipeId',recipesController.deleteRecipe);

router.get('/api/recipes-by-user',recipesController.recipeByUser);

router.get('/api/find-recipe-user/:recipeId',recipesController.fetchRecipeWithUser);


module.exports = router