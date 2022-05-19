const mongoose = require("mongoose");
const Producto = require("../models/producto");

mongoose.connect("mongodb://localhost:27017/productos-total");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const unidades = ["galón", "litro", "botella", "caneca"]

const seedDB = async () => {
    await Producto.deleteMany({});
    for (let i = 0; i < 3; i++) {
        const randNum = Math.floor(Math.random() * 1000) + 200;
        const prod = new Producto({
            nombre: `Producto ${i + 1}`,
            precio: randNum,
            unidad: sample(unidades),
            desc: "Descripción del producto",
            imagen: "https://source.unsplash.com/collection/1130900"
        });
        await prod.save();
    }
}



//Seed DB
seedDB().then(() => {
    mongoose.connection.close();
})

