module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        // console.log(req.path, req.originalUrl);
        // /new /campgrounds/new
        req.session.returnTo = req.originalUrl
        req.flash('error', '¡Debes ingresar primero!');
        return res.redirect('/login');
    }
    next();
}