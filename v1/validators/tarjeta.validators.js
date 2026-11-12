import Joi from "joi";

// se valida y se descarta, nunca se guarda
export const tarjetaSchema = Joi.object({
    numero: Joi.string().creditCard().required().messages({
        'string.empty': 'El número de tarjeta es obligatorio',
        'string.creditCard': 'El número de tarjeta no es válido',
        'any.required': 'El número de tarjeta es obligatorio'
    }),
    titular: Joi.string().trim().min(3).max(60).pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/).required().messages({
        'string.empty': 'El nombre del titular es obligatorio',
        'string.min': 'El nombre del titular debe tener al menos {#limit} caracteres',
        'string.max': 'El nombre del titular no puede tener más de {#limit} caracteres',
        'string.pattern.base': 'El nombre del titular solo puede tener letras',
        'any.required': 'El nombre del titular es obligatorio'
    }),
    vencimiento: Joi.string().pattern(/^(0[1-9]|1[0-2])\/\d{2}$/).required()
        .custom((value, helpers) => {
            const [mes, anio] = value.split("/").map(Number);
            const primerDiaDelMesSiguiente = new Date(2000 + anio, mes, 1);
            if (primerDiaDelMesSiguiente <= new Date()) {
                return helpers.error('tarjeta.vencida');
            }
            return value;
        })
        .messages({
            'string.empty': 'El vencimiento es obligatorio',
            'string.pattern.base': 'El vencimiento debe tener el formato MM/AA',
            'tarjeta.vencida': 'La tarjeta está vencida',
            'any.required': 'El vencimiento es obligatorio'
        }),
    cvv: Joi.string().pattern(/^\d{3,4}$/).required().messages({
        'string.empty': 'El código de seguridad es obligatorio',
        'string.pattern.base': 'El código de seguridad debe tener 3 o 4 números',
        'any.required': 'El código de seguridad es obligatorio'
    })
}).messages({
    'object.unknown': 'El campo {#label} no esta permitido'
});
