const mongooes = require('mongoose');
const Schema = mongooes.Schema;

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    category: String, // may remove it
    description: String, // may remove it
    instructions: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

module.exports = mongooes.model('Recipe', recipeSchema);