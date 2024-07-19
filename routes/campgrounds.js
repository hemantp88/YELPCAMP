const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js')
const campgrounds = require('../controllers/campgrounds.js')
const multer = require('multer')
const { storage } = require('../cloudinary/index.js')
const upload = multer({ storage })



router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send("It worked!!")

// })
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))



module.exports = router;