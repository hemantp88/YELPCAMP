const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');
const passport = require('passport');


router.get('/register', (req, res) => {
    res.render('users/register')
})
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, error => {
            if (error) return next(error);
            req.flash('success', "Welcome to YelpCamp");
            res.redirect('/campgrounds');
        });
        // console.log(registeredUser);

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render("users/login")
})

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),

    (req, res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/campgrounds';

        delete req.session.returnTo;

        res.redirect(redirectUrl);
    });
router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return res.redirect('/login') }
        req.flash('success', 'Successfully Logout');
        res.redirect('/campgrounds');
    });
})

module.exports = router;