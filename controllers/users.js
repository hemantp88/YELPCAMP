const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}
module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, error => {
            if (error) return next(error);
            req.flash('success', "Welcome to YelpCamp");
            res.redirect('/campgrounds');
        });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}
module.exports.renderLogin = (req, res) => {
    res.render("users/login")
}
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';

    delete req.session.returnTo;

    res.redirect(redirectUrl);
}
module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return res.redirect('/login') }
        req.flash('success', 'Successfully Logout');
        res.redirect('/campgrounds');
    });
}