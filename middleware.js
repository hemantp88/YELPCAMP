//  if (!req.isAuthenticated()) {
//         req.flash('error', 'You must be signed in!!');
//         return res.redirect('/login')
//     }
module.exports.isLoggedIn = (req, res, next) => {
    console.log("Req.usre ...... : ", req.user);
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first !!');
        return res.redirect('/login');
    }
    next();
}