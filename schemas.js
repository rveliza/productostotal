const Joi = require("joi");

module.exports.productoSchema = Joi.object({
    producto: Joi.object({
        nombre: Joi.string().required(),
        precio: Joi.number().required().min(0),
        unidad: Joi.string().required(),
        desc: Joi.string().required(),
        imagen: Joi.string().required()
    }).required()
});
