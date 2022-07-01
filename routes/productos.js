const express = require("express");
const router = express.Router();
const productos = require('../controllers/productos');
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateProducto } = require('../middleware');

router.route('/')
    .get(catchAsync(productos.index))
    .post(isLoggedIn, validateProducto, catchAsync(productos.createProducto));

router.get("/new", isLoggedIn, productos.renderNewForm);

router.route('/:id')
    .get(catchAsync(productos.showProducto))
    .put(isLoggedIn, isAuthor, validateProducto, catchAsync(productos.updateProducto))
    .delete(isLoggedIn, isAuthor, catchAsync(productos.deleteProducto));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(productos.renderEditForm));

module.exports = router;