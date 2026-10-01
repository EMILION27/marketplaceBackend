import Joi from "joi";

// Reglas para pedir la descripcion a la IA
export const generarDescripcionSchema = Joi.object({
    titulo: Joi.string().trim().min(2).max(100).required().messages({
        'string.empty': 'El título es obligatorio',
        'string.min': 'El título debe tener al menos {#limit} caracteres',
        'string.max': 'El título no puede tener más de {#limit} caracteres',
        'any.required': 'El título es obligatorio'
    }),
    categoria: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'La categoría es obligatoria',
        'string.min': 'La categoría debe tener al menos {#limit} caracteres',
        'string.max': 'La categoría no puede tener más de {#limit} caracteres',
        'any.required': 'La categoría es obligatoria'
    })
}).messages({
    'object.unknown': 'El campo {#label} no esta permitido'
});