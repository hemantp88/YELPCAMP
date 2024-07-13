const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    reviews:
        [{
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }]
});
module.exports = mongoose.model('Campground', CampgroundSchema)