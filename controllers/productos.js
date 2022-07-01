const Producto = require('../models/producto');

module.exports.index = async (req, res) => {
    const productos = await Producto.find({});
    res.render("productos/index", { productos });
}

module.exports.renderNewForm = (req, res) => {
    res.render("productos/new");
}

module.exports.createProducto = async (req, res, next) => {
    const producto = new Producto(req.body.producto);
    producto.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    producto.author = req.user._id;
    await producto.save();
    console.log(producto);
    req.flash("success", "¡Producto creado con éxito!");
    res.redirect(`/productos/${producto._id}`);
}

module.exports.showProducto = async (req, res) => {
    const producto = await Producto.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!producto) {
        req.flash('error', '!No se pudo encontrar ese producto¡');
        return res.redirect('/productos');
    }
    res.render("productos/show", { producto });
}

module.exports.renderEditForm = async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
        req.flash('error', '!No se pudo encontrar ese producto¡');
        return res.redirect('/productos');
    }
    res.render("productos/edit", { producto });
}

module.exports.updateProducto = async (req, res) => {
    const { id } = req.params;
    const producto = await Producto.findById(id, { ...req.body.campground });
    req.flash('success', '¡Producto actualizado con éxito!')
    res.redirect(`/productos/${producto._id}`);
}

module.exports.deleteProducto = async (req, res) => {
    const { id } = req.params;
    await Producto.findByIdAndDelete(id);
    req.flash('success', "¡Producto eliminado con éxito!");
    res.redirect("/productos");
}