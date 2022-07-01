const express = require("express");
const router = express.Router( {mergeParams: true} );
const catchAsync = require("../utils/catchAsync");
const { validateReview } = require("../middleware");
const Producto = require("../models/producto");
const Review = require('../models/review');


router.post('/', validateReview, catchAsync(async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    const review = new Review(req.body.review);
    producto.reviews.push(review);
    await review.save();
    await producto.save();
    req.flash('success', '!Nuevo comentario creado con éxito!');
    res.redirect(`/productos/${producto._id}`);
}));

router.delete("/:reviewId", catchAsync(async (req, res) =>{
    const { id, reviewId } = req.params;
    await Producto.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', '!Comentario eliminado con éxito!');
    res.redirect(`/productos/${id}`);
}));


module.exports = router;