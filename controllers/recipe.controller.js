const express = require('express');
const router = express.Router();
const Recipes = require('../models/recipe');
const isSignedIn = require('../middleware/is-signed-in');
const { render } = require('ejs');

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
        const foundRecipe = await Recipes.findById(req.params.recipeId).populate('owner').populate('comments.author');
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

router.get('/:recipeId/edit', async (req, res) => {
    const foundRecipe = await Recipes.findById(req.params.recipeId).populate('owner');

    if(foundRecipe.owner._id.equals(req.session.user._id)) {
        return res.render('recipes/edit.ejs', { foundRecipe: foundRecipe });
    }
    return res.send('Not authorized');
   
})

router.put('/:recipeId', async (req, res) => {
    const foundRecipe = await Recipes.findById(req.params.recipeId).populate('owner');
    
    if(foundRecipe.owner._id.equals(req.session.user._id)) {
        await Recipes.findByIdAndUpdate(req.params.recipeId, req.body, { new: true });
        return res.redirect(`/recipes/${req.params.recipeId}`);
    }
    return res.send('Not authorized');
})

router.post('/:recipeId/comments', isSignedIn, async (req, res) => {
    const foundRecipe = await Recipes.findById(req.params.recipeId);
    req.body.author = req.session.user._id;
    foundRecipe.comments.push(req.body);
    await foundRecipe.save()
    res.redirect(`/recipes/${req.params.recipeId}`);
})
module.exports = router;