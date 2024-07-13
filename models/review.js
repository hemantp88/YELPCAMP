const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number
});
module.exports = mongoose.model('Review', reviewSchema)



// body: "The palce is good"
// rating:4/5