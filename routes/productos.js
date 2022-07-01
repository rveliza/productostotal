const express = require("express");
const router = express.Router();
const productos = require('../controllers/productos');
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateProducto } = require('../middleware');


router.get("/", catchAsync(productos.index));

router.get("/new", isLoggedIn, productos.renderNewForm);

router.post("/", isLoggedIn, validateProducto, catchAsync(productos.createProducto));

router.get("/:id", catchAsync(productos.showProducto));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(productos.renderEditForm));

router.put("/:id", isLoggedIn, isAuthor, validateProducto, catchAsync(productos.updateProducto));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(productos.deleteProducto));

module.exports = router;