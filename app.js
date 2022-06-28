if (process.env.MODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const port = process.env.PORT || 4000;

const productos = require('./routes/productos');
const reviews = require('./routes/reviews');

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
app.use(express.urlencoded( {extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use('/productos', productos);
app.use('/productos/:id/reviews', reviews);
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render("home");
});

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Algo salió mal..."; 
    res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});