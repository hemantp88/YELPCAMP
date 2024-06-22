const express = require("express")
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    // res.send("Hello form yelp");
    res.render('home')
})

app.listen(3000, () => {
    console.log("listening on port 3000");
})