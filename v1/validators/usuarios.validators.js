import Joi from "joi";

export const recargarSaldoSchema = Joi.object({
    monto: Joi.number().positive().max(100000).required().messages({
        'number.base': 'El monto debe ser un número',
        'number.positive': 'El monto debe ser mayor a 0',
        'number.max': 'El monto no puede ser mayor a {#limit}',
        'any.required': 'El monto es obligatorio'
    })
}).messages({
    'object.unknown': 'El campo {#label} no esta permitido'
});