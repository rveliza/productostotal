const express = require("express");
const mongoose = require("mongoose");
const Producto = require("./models/producto");
const path = require("path");
const { render } = require("express/lib/response");
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/productos-total");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded( {extended: true }));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/productos", async (req, res) => {
    const productos = await Producto.find({});
    res.render("productos/index", { productos });
});

app.get("/productos/new", (req, res) => {
    res.render("productos/new");
});

app.post("/productos", async (req, res) => {
    // res.send(req.body.producto);
    // {"nombre":"Formol","precio":"23"}
    const producto = new Producto(req.body.producto);
    await producto.save();
    res.redirect(`/productos/${producto._id}`);
});

app.get("/productos/:id", async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    res.render("productos/show", { producto });
});

app.listen(PORT, () => {
    console.log(`Servint on port 3000`);
});