import Joi from "joi";

export const comprarProductoSchema = Joi.object({
    cantidad: Joi.number().integer().min(1).max(100).default(1).messages({
        'number.base': 'La cantidad debe ser un número',
        'number.integer': 'La cantidad debe ser un número entero',
        'number.min': 'La cantidad debe ser al menos {#limit}',
        'number.max': 'No podés comprar más de {#limit} unidades juntas'
    })
}).default().messages({       
    'object.unknown': 'El campo {#label} no esta permitido'
});