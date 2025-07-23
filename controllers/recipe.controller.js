const express = require('express');
const router = express.Router();
const Recipes = require('../models/recipe');
const Favorite = require('../models/favorite');
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
    const favorites = await Favorite.find({ user: req.session.user._id });

    res.render('recipes/index.ejs', { foundRecipes: foundRecipes, favorites: favorites });
})

router.get('/favorites', isSignedIn, async (req, res) => {
    const favorites = await Favorite.find({ user: req.session.user._id }).populate('recipe');
    res.render('recipes/favorites.ejs', { favorites: favorites });
})

router.get('/:recipeId', async (req, res) => {
    try {
        const foundRecipe = await Recipes.findById(req.params.recipeId).populate('owner').populate('comments.author');
        const favorites = await Favorite.find({ user: req.session.user._id });
        res.render('recipes/show.ejs', { foundRecipe: foundRecipe , favorites: favorites});
    
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

router.post('/:recipeId/favorite', isSignedIn, async (req, res) => {
    const userId = req.session.user._id;
    const recipeId = req.params.recipeId;

    const inFavorite = await Favorite.findOne({ user: userId, recipe: recipeId});

    if(inFavorite) {
        await inFavorite.deleteOne();
    } else {
        await Favorite.create({ user: userId, recipe: recipeId });
    }

    res.redirect(`/recipes/${recipeId}`);
})

router.post('/:recipeId/favorites', isSignedIn, async (req, res) => {
    const userId = req.session.user._id;
    const recipeId = req.params.recipeId;

    const inFavorite = await Favorite.findOne({ user: userId, recipe: recipeId});

    if(inFavorite) {
        await inFavorite.deleteOne();
    } else {
        await Favorite.create({ user: userId, recipe: recipeId });
    }

    res.redirect(`/recipes`);
})

module.exports = router;