if (process.env.MODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Producto = require("./models/producto");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { productoSchema, reviewSchema } = require('./schemas.js')
const Review = require('./models/review');
const port = process.env.PORT || 4000;

const productos = require('./routes/productos')

// const dbURL = "mongodb://localhost:27017/productos-total"
const dbURL = process.env.DB_URL
mongoose.connect(dbURL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded( {extended: true }));
app.use(methodOverride("_method"));


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error ) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.use('/productos', productos);

app.get("/", (req, res) => {
    res.render("home");
});



app.post('/productos/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    const review = new Review(req.body.review);
    producto.reviews.push(review);
    await review.save();
    await producto.save();
    res.redirect(`/productos/${producto._id}`);
}));

app.delete("/productos/:id/reviews/:reviewId", catchAsync(async (req, res) =>{
    //  res.send("DELETE ME!!"); 
    const { id, reviewId } = req.params;
    await Producto.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/productos/${id}`);
}));

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found!", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Algo salió mal..."; 
    res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});