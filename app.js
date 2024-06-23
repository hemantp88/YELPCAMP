const express = require("express")
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection Error"));
db.once("open", () => {
    console.log("Database Connected");
})

const app = express();
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    // res.send("Hello form yelp");
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})
app.post('/campgrounds', async (req, res) => {
    // res.send(req.body.campground);
    const { title, location } = req.body.campground;
    const campground = new Campground({ location: location, title: title });
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})
app.get('/campgrounds/:id', async (req, res,) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
})

app.listen(3000, () => {
    console.log("listening on port 3000");
})