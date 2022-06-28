const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review')

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

ProductoSchema.post("findOneAndDelete", async function (doc) {
    // console.log("DELETED!!!!");
    // console.log(doc);
    if (doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

module.exports = mongoose.model("Producto", ProductoSchema);