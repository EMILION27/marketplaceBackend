import jwt from "jsonwebtoken";

export const generarToken = (usuario) => {
    return jwt.sign(
        { id: usuario._id, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
}