const { productoSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Producto = require("./models/producto");

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

module.exports.validateProducto = (req, res, next) => {
    const { error } = productoSchema.validate(req.body);
    if(error ) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const producto = await Producto.findById(id);
    if(!producto.author.equals(req.user._id)) {
        req.flash('error', '¡No tienes permiso para hacer eso!');
        return res.redirect(`/productos/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error ) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

