const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

const Campground = require('../models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection Error"));
db.once("open", () => {
    console.log("Database Connected");
})
const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '6698cb3be2a29926130dd1be',
            location: `${cities[random1000].city}, ${cities[random1000].state} `,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://picsum.photos/200/300",
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.Laudantium sapiente enim natus, non, accusantium officia, sequi ratione inventore deleniti officiis corporis.Aut quisquam cumque repellat placeat doloremque mollitia a eos.",
            price: 23
        })
        await camp.save()
    }

}
seedDB().then(() => { mongoose.connection.close(); });