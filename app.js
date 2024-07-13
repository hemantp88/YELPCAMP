const express = require("express")
const path = require('path');
const mongoose = require('mongoose');
const catchAsync = require("./utils/catchAsync");
const methodOverride = require('method-override')
const Campground = require('./models/campground');
const ExpressError = require("./utils/ExpressError");
const ejsMate = require('ejs-mate');
const Joi = require('joi')
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const campground = require("./models/campground");
const Review = require('./models/review.js')

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection Error"));
db.once("open", () => {
    console.log("Database Connected");
})

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


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
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    // console.log(error);
    if (error) {
        // console.log(error)
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}


app.engine('ejs', ejsMate)

const verifyPassword = ((req, res, next) => {
    const { password } = req.query;
    if (password === 'chickenNuggets')
        next();
    // res.send("Sorry ypu need a password!!!!");
    throw new Error("Password Required");
})
app.get("/secret", verifyPassword, (req, res) => {
    res.send("My secret is : sometime ")
})


app.get('/', (req, res) => {
    // res.send("Hello form yelp");
    res.render('home')
})



app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

//creating new campground
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // res.send(req.body.campground);
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);

    const { title, location, image, description, price } = req.body.campground;
    const campground = new Campground({ location: location, title: title, image: image, description: description, price: price });
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))
app.get('/campgrounds/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    console.log(campground)
    res.render('campgrounds/show', { campground });
}))
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))
//updatting campground
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    // res.send("IT worked");
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    // console.log("goggommf")
    res.redirect(`/campgrounds/${campground._id}`);
}))
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');

}))

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.all('*', (req, res, next) => {
    // res.send("404!!!!");
    next(new ExpressError("Pgae Not found", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.meassge) err.meassge = "oh! no something went wrong!";
    res.status(statusCode).render('error', { err })
    // res.send("oh boy error");
})

// app.use((req, res) => {
//     res.status(404).send("Not found");
// })
app.listen(3000, () => {
    console.log("listening on port 3000");
})
