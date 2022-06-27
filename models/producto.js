const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductoSchema = new Schema({
    nombre: String,
    precio: Number,
    unidad: String,
    desc: String,
    imagen: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

module.exports = mongoose.model("Producto", ProductoSchema);