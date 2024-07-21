if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const dbUrl=process.env.DB_URL||'mongodb://0.0.0.0:27017/yelp-camp';
const express = require("express")
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require("./utils/ExpressError");
const ejsMate = require('ejs-mate');
const campgroundRoutes = require('./routes/campgrounds.js');
const userRoutes = require('./routes/users.js')
const reviewRoutes = require('./routes/reviews.js');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const session = require('express-session');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
const helmet=require('helmet');
const secret = process.env.SECRET||'this should be better secret';
const port= process.env.PORT||3000;


mongoose.connect(dbUrl);
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
app.use(mongoSanitize({
    replaceWith: '_'
}))
  app.use(helmet());
  

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dfe7zgjf4/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);




const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
});

store.on('error',function(e){
    console.log("Session store error",e);
})
const sessionConfig = {
    store:store,
    name:'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}



app.use(session(sessionConfig))
app.use(flash());


// const { setUser } = require('./middleware');
// app.use(setUser);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//storage user
passport.deserializeUser(User.deserializeUser());//unstorage user       




app.engine('ejs', ejsMate)

const verifyPassword = ((req, res, next) => {
    const { password } = req.query;
    if (password === 'chickenNuggets')
        next();
    throw new Error("Password Required");
})



app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'hp@gmail.com', username: 'hp' });
    const newUser = await User.register(user, 'Hattu@03')
    res.send(newUser);
})
app.get("/secret", verifyPassword, (req, res) => {
    res.send("My secret is : sometime ")
})


app.get('/', (req, res) => {
    res.render('home',{currentUser:req.body})
})

app.use((req, res, next) => {
    app.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();

})
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


app.all('*', (req, res, next) => {
    next(new ExpressError("Pgae Not found", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.meassge) err.meassge = "oh! no something went wrong!";
    res.status(statusCode).render('error', { err })

})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})

