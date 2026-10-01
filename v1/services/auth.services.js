import bcrypt from "bcryptjs";
import Usuario from "../models/usuario.model.js";
import { generarToken } from "../utils/token.util.js"; 
import { usuarioSinPassword } from "../utils/usuario.util.js";
export const registerService = async (usuarioData) => {
    const { nombre, apellido, email, password } = usuarioData; 

    const usuarioEncontrado = await Usuario.findOne({ email });
    if (usuarioEncontrado) {
        const errorExiste = new Error("Ya existe un usuario con ese email");
        errorExiste.status = 409;
        throw errorExiste;
    }

    const hashedPassword = bcrypt.hashSync(password, Number(process.env.SALTING_ROUNDS));
    const nuevoUsuario = new Usuario({ nombre, apellido, email, password: hashedPassword });
    await nuevoUsuario.save();

    const token = generarToken(nuevoUsuario);
    return { token, usuario: usuarioSinPassword(nuevoUsuario) };
}

export const loginService = async (email, password) => {
    const usuarioEncontrado = await Usuario.findOne({ email });
    if (!usuarioEncontrado) {
        const errorLogin = new Error("Email y/o contraseña incorrectos");
        errorLogin.status = 401;
        throw errorLogin;
    }

    const valid = bcrypt.compareSync(password, usuarioEncontrado.password);
    if (!valid) {
        const errorLogin = new Error("Email y/o contraseña incorrectos");
        errorLogin.status = 401;
        throw errorLogin;
    }

    const token = generarToken(usuarioEncontrado);
    return { token, usuario: usuarioSinPassword(usuarioEncontrado) };
}



