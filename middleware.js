module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', '¡Debes ingresar primero!');
        return res.redirect('/login');
    }
    next();
}