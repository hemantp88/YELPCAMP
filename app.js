const express = require("express")
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');


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

app.engine('ejs', ejsMate)

const verifyPassword = ((req, res, next) => {
    const { password } = req.query;
    if (password === 'chickenNuggets')
        next();
    res.send("Sorry ypu need a password!!!!");
})
app.get("/secret", verifyPassword, (req, res) => {
    res.send("My secret is : sometime ")
})


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
    const { title, location, image, description, price } = req.body.campground;

    const campground = new Campground({ location: location, title: title, image: image, description: description, price: price });
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})
app.get('/campgrounds/:id', async (req, res,) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
})
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
})
app.put('/campgrounds/:id', async (req, res) => {
    // res.send("IT worked");
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    // console.log("goggommf")
    res.redirect(`/campgrounds/${campground._id}`);
})
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');

})


app.use((req, res) => {
    res.status(404).send("Not found");
})
app.listen(3000, () => {
    console.log("listening on port 3000");
})
