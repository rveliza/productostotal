const Joi = require("joi");

module.exports.productoSchema = Joi.object({
    producto: Joi.object({
        nombre: Joi.string().required(),
        precio: Joi.number().required().min(0),
        unidad: Joi.string().required(),
        desc: Joi.string().required(),
        // imagen: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});