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
        console.log(req.body)
        await Recipes.create(req.body);
        res.redirect('/recipes')
    } catch (error) {
        console.log(error);
        res.send('Something went wrong')
    }
})

router.get('/', (req, res) => {
    res.send('do i work?')
})

module.exports = router;