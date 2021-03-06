const express = require("express");
const router = express.Router();
const productos = require('../controllers/productos');
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateProducto } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(productos.index))
    .post(isLoggedIn, upload.array('image'), validateProducto, catchAsync(productos.createProducto));
    // .post(upload.array('image'), (req, res) => {
    //     console.log(req.body, req.files);
    //     res.send('It Worked!');
    // });

router.get("/new", isLoggedIn, productos.renderNewForm);

router.route('/:id')
    .get(catchAsync(productos.showProducto))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateProducto, catchAsync(productos.updateProducto))
    .delete(isLoggedIn, isAuthor, catchAsync(productos.deleteProducto));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(productos.renderEditForm));

module.exports = router;