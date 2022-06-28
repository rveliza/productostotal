const express = require("express");
const router = express.Router( {mergeParams: true} );
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Producto = require("../models/producto");
const Review = require('../models/review');
const { reviewSchema } = require('../schemas.js')



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error ) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}



app.post('/', validateReview, catchAsync(async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    const review = new Review(req.body.review);
    producto.reviews.push(review);
    await review.save();
    await producto.save();
    res.redirect(`/productos/${producto._id}`);
}));

app.delete("/:reviewId", catchAsync(async (req, res) =>{
    const { id, reviewId } = req.params;
    await Producto.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/productos/${id}`);
}));

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found!", 404));
})


module.exports = router;