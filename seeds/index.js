const mongoose = require("mongoose");
const Producto = require("../models/producto");

// const dbURL = mongodb://localhost:27017/productos-total
const dbURL = "mongodb+srv://andres:dPmEolcIaCJcekG3@cluster0.1wqjv.mongodb.net/?retryWrites=true&w=majority"
console.log(dbURL)
mongoose.connect(dbURL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const unidades = ["galón", "litro", "botella", "caneca"]

const seedDB = async () => {
    await Producto.deleteMany({});
    for (let i = 0; i < 4; i++) {
        const randNum = Math.floor(Math.random() * 1000) + 200;
        const prod = new Producto({
            author: "62bf0875f60b11e9f9ead2c1",
            nombre: `Producto ${i + 1}`,
            precio: randNum,
            unidad: sample(unidades),
            desc: "Descripción del producto",
            images: [
                {
                  url: 'https://res.cloudinary.com/dtrnszbzg/image/upload/v1656726820/ProductosTotal/prodTotal_wkgqmj.jpg',
                  filename: 'ProductosTotal/prodTotal_wkgqmj'
                }
              ]
        });
        await prod.save();
    }
}



//Seed DB
seedDB().then(() => {
    mongoose.connection.close();
});

