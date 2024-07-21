const mongoose = require('mongoose');
const Review = require('./review');
const { required } = require('joi');
const Schema = mongoose.Schema;
const opts  ={toJSON:{virtuals:true}};

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
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        }, coordinates: {
            type: [Number],
            required: true
        }
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
},opts);









CampgroundSchema.virtual('properties.popUpMarkp').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p> `;
})


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