const express = require("express");
const mongoose = require("mongoose");
const Producto = require("./models/producto");
const path = require("path");
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

app.get("/", (req, res) => {
    res.render("home");
});

//Testear Producto
app.get("/crearproducto", async (req, res) => {
    const prod = new Producto({
        nombre: "Producto 1",
        precio: "55",
        desc: "Mata todo",
        imagen: "Cucaracha muerta"
    });
    await prod.save();
    res.send(prod);
})

app.listen(PORT, () => {
    console.log(`Servint on port 3000`);
});