const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})


const CampgroundSchema = new Schema({
    title: {
        type: String
    },
    images: {
        type: [ImageSchema]
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
        }],
    author:
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    // console.log(doc);
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Campground', CampgroundSchema)