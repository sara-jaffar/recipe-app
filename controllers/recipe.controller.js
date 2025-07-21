const express = require('express');
const router = express.Router();
const Recipes = require('../models/recipe');
const isSignedIn = require('../middleware/is-signed-in');

router.get('/new', isSignedIn , (req, res) => {
    res.render('recipes/new.ejs');
})

router.post('/', isSignedIn, async (req, res) => {
    try {
        req.body.owner = req.session.user._id;
        console.log(req.body);
        await Recipes.create(req.body);
        res.redirect('/recipes');
    } catch (error) {
        console.log(error);
        res.send('Something went wrong');
    }
})

router.get('/', async (req, res) => {
    const foundRecipes = await Recipes.find();
    res.render('recipes/index.ejs', { foundRecipes: foundRecipes});
})

router.get('/:recipeId', async (req, res) => {
    try {
        const foundRecipe = await Recipes.findById(req.params.recipeId).populate('owner');
        console.log(foundRecipe)
        res.render('recipes/show.ejs', { foundRecipe: foundRecipe });
    
    } catch (error) {
        console.log(error);
        res.send('Something went wrong');
    }
})

router.delete('/:recipeId', async (req, res) => {
    const foundRecipe = await Recipes.findById(req.params.recipeId).populate('owner');

    if(foundRecipe.owner._id.equals(req.session.user._id)) {
        await foundRecipe.deleteOne();
        return res.redirect('/recipes');
    }
    return res.send('Not authorized');
})
module.exports = router;