const express = require('express');
const router = express.Router();
const Recipes = require('../models/recipe');
const isSignedIn = require('../middleware/is-signed-in');

router.get('/new', (req, res) => {
    res.render('recipes/new.ejs');
})

module.exports = router;