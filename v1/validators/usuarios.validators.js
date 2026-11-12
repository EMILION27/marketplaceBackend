import Joi from "joi";
import { tarjetaSchema } from "./tarjeta.validators.js";

export const cambiarPlanSchema = Joi.object({
    tarjeta: tarjetaSchema.required().messages({
        'any.required': 'Los datos de la tarjeta son obligatorios'
    })
}).messages({
    'object.unknown': 'El campo {#label} no esta permitido'
});

export const editarPerfilSchema = Joi.object({
    nombre: Joi.string().trim().min(2).max(100).messages({
        'string.empty': 'El nombre no puede quedar vacío',
        'string.min': 'El nombre debe tener al menos {#limit} caracteres',
        'string.max': 'El nombre no puede tener mas de {#limit} caracteres'
    }),
    apellido: Joi.string().trim().min(2).max(100).messages({
        'string.empty': 'El apellido no puede quedar vacío',
        'string.min': 'El apellido debe tener al menos {#limit} caracteres',
        'string.max': 'El apellido no puede tener mas de {#limit} caracteres'
    }),
    foto: Joi.string().uri().messages({
        'string.uri': 'La foto debe ser una URL válida'
    }),
    nombreUsuario: Joi.string().trim().min(3).max(30).pattern(/^[a-zA-Z0-9._]+$/).messages({
        'string.empty': 'El nombre de usuario no puede quedar vacío',
        'string.min': 'El nombre de usuario debe tener al menos {#limit} caracteres',
        'string.max': 'El nombre de usuario no puede tener mas de {#limit} caracteres',
        'string.pattern.base': 'El nombre de usuario solo puede tener letras, números, puntos y guiones bajos'
    }),
    descripcion: Joi.string().trim().max(300).allow("").messages({
        'string.max': 'La descripción no puede tener mas de {#limit} caracteres'
    }),
    redes: Joi.object({
        instagram: Joi.string().uri().allow("").messages({ 'string.uri': 'El enlace de Instagram debe ser una URL válida' }),
        facebook: Joi.string().uri().allow("").messages({ 'string.uri': 'El enlace de Facebook debe ser una URL válida' }),
        sitioWeb: Joi.string().uri().allow("").messages({ 'string.uri': 'El sitio web debe ser una URL válida' })
    })
}).min(1).messages({
    'object.min': 'Tenés que mandar al menos un campo para editar',
    'object.unknown': 'El campo {#label} no esta permitido'
});
