const Producto = require('../models/producto');
const Review = require('../models/revew');

module.exports.createReview = async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    producto.reviews.push(review);
    await review.save();
    await producto.save();
    req.flash('success', '!Nuevo comentario creado con éxito!');
    res.redirect(`/productos/${producto._id}`);
}

module.exports.deleteReview = async (req, res) =>{
    const { id, reviewId } = req.params;
    await Producto.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', '!Comentario eliminado con éxito!');
    res.redirect(`/productos/${id}`);
}