const mongooes = require('mongoose');
const Schema = mongooes.Schema;

const commentSchema = new Schema({
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
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
    },
    img: String,
    comments: [commentSchema]
}, { timestamps: true })

module.exports = mongooes.model('Recipe', recipeSchema);