const express = require('express');
const Recipe = require('../models/recipe.js');
const User = require('../models/user');


exports.getIndexRecipes = (req, res, next) => {
  Recipe.findAll()
    .then(
      recipes => {
        res.json(recipes);
      }
    ).catch( err => console.log(err))
  
};



exports.createRecipe = async (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const { title, description } = req.body;
  const image = req.file;

  if (!title || !description) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  if (!image) {
    return res.status(400).json({ error: "Imagem inválida" });
  }

  const imageUrl = `/images/${image.filename}`;

  try {
    const recipe = await Recipe.create({
      title,
      description,
      image: imageUrl,
      userId: req.session.user.id,
    });

    return res.status(201).json(recipe); // <- importante para testes
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
};
exports.fetchRecipe = (req,res,next) => {
  const recipeId = req.params.recipeId

  Recipe.findByPk(recipeId)
  .then(
    recipe =>{
      res.json(recipe)
    }
  )
}

exports.editRecipe = (req,res,next) => {
  const recipeId = req.params.recipeId;
  const image = req.file;
  

  Recipe.findByPk(recipeId)
    .then(
      recipe => {
        if(image){
          recipe.image = `/images/${req.file.filename}`;
        }
        recipe.title = req.body.title
        recipe.description = req.body.description
        return recipe.save();
      }
    )
    .then(result => {
      res.redirect('/');
    })
}
exports.deleteRecipe = (req,res,next) => {
  const recipeId = req.params.recipeId
  Recipe.findByPk(recipeId)
  .then(
    recipe => {
      return recipe.destroy()
    }
  )
  .then(
    result => {
      res.redirect('/');
    }
  )
}



exports.recipeByUser = (req, res, next) => {
  if (!req.session || !req.session.isLoggedIn) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  Recipe.findAll({ where: { userId: req.session.user.id } })
    .then(recipes => {
      res.json(recipes);
    })
    .catch(err => console.log(err));
};


exports.fetchRecipeWithUser = (req, res, next) => {
  const recipeId = req.params.recipeId;

  Recipe.findByPk(recipeId, {
    include: [{
      model: User,
      attributes: ["name"] // só pegar o nome
    }]
  })
  .then(recipe => {
    if (!recipe) return res.status(404).json({ error: "Receita não encontrada" });
    res.json(recipe);
  })
  .catch(err => console.error(err));
};