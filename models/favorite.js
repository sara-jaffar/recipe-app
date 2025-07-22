const mongooes = require('mongoose');
const Schema = mongooes.Schema;

const favoriteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipe: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    }
})

module.exports = mongooes.model('Favorite' , favoriteSchema);