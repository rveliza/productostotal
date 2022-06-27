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
const port = process.env.PORT || 4000;


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

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/productos", catchAsync(async (req, res) => {
    const productos = await Producto.find({});
    res.render("productos/index", { productos });
}));

app.get("/productos/new", (req, res) => {
    res.render("productos/new");
});

app.post("/productos", catchAsync(async (req, res, next) => {
    if(!req.body.producto) throw new ExpressError("Invalid Producto Data", 400);
        const producto = new Producto(req.body.producto);
        await producto.save();
        res.redirect(`/productos/${producto._id}`);
}));

app.get("/productos/:id", catchAsync(async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    res.render("productos/show", { producto });
}));

app.get("/productos/:id/edit", catchAsync(async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    res.render("productos/edit", { producto });
}));

app.put("/productos/:id", catchAsync(async (req, res) => {
    // res.send("IT WORKED!");
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, {...req.body.producto});
    res.redirect(`/productos/${producto._id}`);
}));

app.delete("/productos/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Producto.findByIdAndDelete(id);
    res.redirect("/productos");
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