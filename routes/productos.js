const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Producto = require("../models/producto");
const { productoSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');


const validateProducto = (req, res, next) => {
    const { error } = productoSchema.validate(req.body);
    if(error ) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get("/", catchAsync(async (req, res) => {
    const productos = await Producto.find({});
    res.render("productos/index", { productos });
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("productos/new");
});

router.post("/", isLoggedIn, validateProducto, catchAsync(async (req, res, next) => {
    const producto = new Producto(req.body.producto);
    producto.author = req.user._id;
    await producto.save();
    req.flash("success", "¡Producto creado con éxito!");
    res.redirect(`/productos/${producto._id}`);
}));

router.get("/:id", catchAsync(async (req, res) => {
    const producto = await Producto.findById(req.params.id).populate('reviews').populate('author');
    if (!producto) {
        req.flash('error', '!No se pudo encontrar ese producto¡');
        return res.redirect('/productos');
    }
    res.render("productos/show", { producto });
}));

router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
        req.flash('error', '!No se pudo encontrar ese producto¡');
        return res.redirect('/productos');
    }
    res.render("productos/edit", { producto });
}));

router.put("/:id", isLoggedIn, validateProducto, catchAsync(async (req, res) => {
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, {...req.body.producto});
    req.flash('success', '¡Producto actualizado con éxito!')
    res.redirect(`/productos/${producto._id}`);
}));

router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Producto.findByIdAndDelete(id);
    req.flash('success', "¡Producto eliminado con éxito!");
    res.redirect("/productos");
}));

module.exports = router;