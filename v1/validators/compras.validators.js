import Joi from "joi";
import { tarjetaSchema } from "./tarjeta.validators.js";

export const pagarCarritoSchema = Joi.object({
    items: Joi.array().items(
        Joi.object({
            producto: Joi.string().hex().length(24).required().messages({
                'string.hex': 'Uno de los productos no es válido',
                'string.length': 'Uno de los productos no es válido',
                'any.required': 'Falta el producto en uno de los ítems'
            }),
            cantidad: Joi.number().integer().min(1).max(100).required().messages({
                'number.base': 'La cantidad debe ser un número',
                'number.integer': 'La cantidad debe ser un número entero',
                'number.min': 'La cantidad debe ser al menos {#limit}',
                'number.max': 'No podés comprar más de {#limit} unidades de un mismo producto',
                'any.required': 'Falta la cantidad en uno de los ítems'
            })
        }).messages({
            'object.unknown': 'El campo {#label} no esta permitido'
        })
    ).min(1).max(20).unique('producto').required().messages({
        'array.base': 'El carrito no es válido',
        'array.min': 'El carrito está vacío',
        'array.max': 'El carrito no puede tener más de {#limit} productos distintos',
        'array.unique': 'Hay un producto repetido en el carrito',
        'any.required': 'El carrito es obligatorio'
    }),
    tarjeta: tarjetaSchema.required().messages({
        'any.required': 'Los datos de la tarjeta son obligatorios'
    })
}).messages({
    'object.unknown': 'El campo {#label} no esta permitido'
});
