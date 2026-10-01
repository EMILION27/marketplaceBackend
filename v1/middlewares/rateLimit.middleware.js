import rateLimit from "express-rate-limit";


export const limiterGlobal = rateLimit
({
    windowMs: 1*60 * 1000,
    max : 100,
    message: {message:"Demasiadas Solicitudes desde esta IP, Intenta mas tarde"}
});
export const limiterLogin = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5,
    skipSuccessfulRequests: true, // los logins correctos no cuentan
    message: { message: "Demasiados intentos de login. Probá de nuevo en 15 minutos" }
});


export const limiterSaldo = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 3,
    keyGenerator: (req) => req.user.id, // limitamos por ID de usuario, como en el ejemplo del profe
    message: { message: "Demasiadas recargas en poco tiempo. Intentá más tarde" }
});


export const limiterCompra = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 5,
    keyGenerator: (req) => req.user.id, // limitamos por ID de usuario
    message: { message: "Demasiadas compras en poco tiempo. Intentá más tarde" }
});