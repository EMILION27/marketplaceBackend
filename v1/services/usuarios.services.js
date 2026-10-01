import Usuario from "../models/usuario.model.js";
import { usuarioSinPassword } from "../utils/usuario.util.js";

export const obtenerPerfilService = async (id) => {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
        const errorNotFound = new Error("Usuario no encontrado");
        errorNotFound.status = 404;
        throw errorNotFound;
    }
    return usuarioSinPassword(usuario);
}

export const cambiarPlanService = async (id) => {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
        const errorNotFound = new Error("Usuario no encontrado");
        errorNotFound.status = 404;
        throw errorNotFound;
    }
    if (usuario.plan === "premium") {
        const errorPlan = new Error("El usuario ya tiene el plan premium");
        errorPlan.status = 409;
        throw errorPlan;
    }
    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, { plan: "premium" }, { returnDocument: 'after' });
    return usuarioSinPassword(usuarioActualizado);
}

export const recargarSaldoService = async (id, monto) => {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, { $inc: { saldo: monto } }, { returnDocument: 'after' });
    if (!usuarioActualizado) {
        const errorNotFound = new Error("Usuario no encontrado");
        errorNotFound.status = 404;
        throw errorNotFound;
    }
    return usuarioSinPassword(usuarioActualizado);
}