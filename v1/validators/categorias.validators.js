import Joi from "joi";

export const categoriaSchema = Joi.object({
    nombre: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'El nombre de la categoría es obligatorio',
        'string.min': 'El nombre debe tener al menos {#limit} caracteres',
        'string.max': 'El nombre no puede tener más de {#limit} caracteres',
        'any.required': 'El nombre de la categoría es obligatorio'
    })
}).messages({
    'object.unknown': 'El campo {#label} no esta permitido'
});
