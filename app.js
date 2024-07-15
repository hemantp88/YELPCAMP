const express = require("express")
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require("./utils/ExpressError");
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const campgrounds = require('./routes/campgrounds.js');
const reviews = require('./routes/reviews.js');


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
app.use(express.static(path.join(__dirname, 'public')))




app.engine('ejs', ejsMate)

const verifyPassword = ((req, res, next) => {
    const { password } = req.query;
    if (password === 'chickenNuggets')
        next();
    throw new Error("Password Required");
})
app.get("/secret", verifyPassword, (req, res) => {
    res.send("My secret is : sometime ")
})


app.get('/', (req, res) => {
    res.render('home')
})

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);



app.all('*', (req, res, next) => {
    next(new ExpressError("Pgae Not found", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.meassge) err.meassge = "oh! no something went wrong!";
    res.status(statusCode).render('error', { err })

})

app.listen(3000, () => {
    console.log("listening on port 3000");
})
