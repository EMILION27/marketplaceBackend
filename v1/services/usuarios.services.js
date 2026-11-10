import { isValidObjectId } from "mongoose";
import Usuario from "../models/usuario.model.js";
import Producto from "../models/producto.model.js";
import { usuarioSinPassword } from "../utils/usuario.util.js";

const precioPremium = 500; // pago único simulado en pesos uruguayos

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
    return { usuario: usuarioSinPassword(usuarioActualizado), precio: precioPremium };
}
export const editarPerfilService = async (id, perfilData) => {
    if (perfilData.nombreUsuario) {
        const nombreUsuario = perfilData.nombreUsuario.toLowerCase();
        const usuarioConEseNombre = await Usuario.findOne({ nombreUsuario, _id: { $ne: id } });
        if (usuarioConEseNombre) {
            const errorExiste = new Error("Ese nombre de usuario ya está en uso");
            errorExiste.status = 409;
            throw errorExiste;
        }
    }

    // Las redes se guardan una por una, para no borrar las que no se mandaron
    const { redes, ...resto } = perfilData;
    const cambios = { ...resto };
    if (redes) {
        for (const red in redes) {
            cambios[`redes.${red}`] = redes[red];
        }
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, cambios, { returnDocument: 'after' });
    if (!usuarioActualizado) {
        const errorNotFound = new Error("Usuario no encontrado");
        errorNotFound.status = 404;
        throw errorNotFound;
    }
    return usuarioSinPassword(usuarioActualizado);
}

// Perfil público de un vendedor: solo datos públicos (nunca email, saldo, plan, compras ni contraseña)
export const obtenerPerfilPublicoService = async (id) => {
    if (!isValidObjectId(id)) {
        const errorId = new Error("El id del usuario no es válido");
        errorId.status = 400;
        throw errorId;
    }
    const usuario = await Usuario.findById(id).select("nombre apellido foto nombreUsuario descripcion redes createdAt");
    if (!usuario) {
        const errorNotFound = new Error("Usuario no encontrado");
        errorNotFound.status = 404;
        throw errorNotFound;
    }
    const productos = await Producto.find({ vendedor: id })
        .sort({ createdAt: -1 })
        .populate("categoria", "nombre");
    return { usuario, productos };
}
