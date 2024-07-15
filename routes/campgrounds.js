const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require('../models/campground');
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema } = require('../schemas.js');


const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    // console.log(result);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

//creating new campground
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // res.send(req.body.campground);
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);

    const { title, location, image, description, price } = req.body.campground;
    const campground = new Campground({ location: location, title: title, image: image, description: description, price: price });
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))
router.get('/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    // console.log(campground)
    res.render('campgrounds/show', { campground });
}))
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))
//updatting campground
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    // res.send("IT worked");
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    // console.log("goggommf")
    res.redirect(`/campgrounds/${campground._id}`);
}))
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');

}))

module.exports = router;