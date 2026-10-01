import Joi from 'joi';

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'El email es obligatorio',
        'string.email': 'El email debe tener un formato válido',
        'any.required': 'El email es obligatorio'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'La contraseña es obligatoria',
        'any.required': 'La contraseña es obligatoria'
    })
}).messages({
    'object.unknown': 'El campo {#label} no esta permitido'
})


export const registerSchema = Joi.object({
    nombre: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'El nombre debe tener al menos {#limit} caracteres',
        'string.max': 'El nombre no puede tener mas de {#limit} caracteres',
        'any.required': 'El nombre es obligatorio'
    }),
    apellido: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El apellido es obligatorio',
        'string.min': 'El apellido debe tener al menos {#limit} caracteres',
        'string.max': 'El apellido no puede tener mas de {#limit} caracteres',
        'any.required': 'El apellido es obligatorio'
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'El email es obligatorio',
        'string.email': 'El email debe tener un formato válido',
        'any.required': 'El email es obligatorio'
    }),
    password: Joi.string().min(6).pattern(/^(?=.*[a-zA-Z])(?=.*\d)/).required().messages({
        'string.empty': 'La contraseña es obligatoria',
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'string.pattern.base': 'La contraseña debe tener al menos una letra y un número',
        'any.required': 'La contraseña es obligatoria'
    }),
    repetirPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'string.empty': 'Repetir la contraseña es obligatorio',
        'any.only': 'Las contraseñas no coinciden',
        'any.required': 'Repetir la contraseña es obligatorio'
    })
}).messages({
    'object.unknown': 'El campo {#label} no esta permitido'
});
