import Joi from "joi";

export const agregarProductoSchema = Joi.object({
    titulo: Joi.string().trim().min(2).max(100).required().messages({
        'string.empty': 'El título es obligatorio',
        'string.min': 'El título debe tener al menos {#limit} caracteres',
        'string.max': 'El título no puede tener más de {#limit} caracteres',
        'any.required': 'El título es obligatorio'
    }),
    precio: Joi.number().positive().required().messages({
        'number.base': 'El precio debe ser un número',
        'number.positive': 'El precio debe ser mayor a 0',
        'any.required': 'El precio es obligatorio'
    }),
    stock: Joi.number().integer().min(0).required().messages({
        'number.base': 'El stock debe ser un número',
        'number.integer': 'El stock debe ser un número entero',
        'number.min': 'El stock no puede ser negativo',
        'any.required': 'El stock es obligatorio'
    }),
    categoria: Joi.string().hex().length(24).required().messages({
        'string.hex': 'La categoría no es válida',
        'string.length': 'La categoría no es válida',
        'any.required': 'La categoría es obligatoria'
    }),
    descripcion: Joi.string().max(1000).allow("").optional().messages({
        'string.max': 'La descripción no puede tener más de {#limit} caracteres'
    }),
    imagen: Joi.string().uri().optional().messages({
        'string.uri': 'La imagen debe ser una URL válida'
    })
}).messages({
    'object.unknown': 'El campo {#label} no esta permitido'
});


export const actualizarProductoSchema = Joi.object({
    titulo: Joi.string().trim().min(2).max(100).messages({
        'string.min': 'El título debe tener al menos {#limit} caracteres',
        'string.max': 'El título no puede tener más de {#limit} caracteres'
    }),
    precio: Joi.number().positive().messages({
        'number.base': 'El precio debe ser un número',
        'number.positive': 'El precio debe ser mayor a 0'
    }),
    stock: Joi.number().integer().min(0).messages({
        'number.base': 'El stock debe ser un número',
        'number.integer': 'El stock debe ser un número entero',
        'number.min': 'El stock no puede ser negativo'
    }),
    categoria: Joi.string().hex().length(24).messages({
        'string.hex': 'La categoría no es válida',
        'string.length': 'La categoría no es válida'
    }),
    descripcion: Joi.string().max(1000).allow("").messages({
        'string.max': 'La descripción no puede tener más de {#limit} caracteres'
    }),
    imagen: Joi.string().uri().messages({
        'string.uri': 'La imagen debe ser una URL válida'
    })
}).min(1).messages({
    'object.min': 'Tenés que mandar al menos un campo para editar',
    'object.unknown': 'El campo {#label} no esta permitido'
});