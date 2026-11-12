import { isValidObjectId } from "mongoose";
import Usuario from "../models/usuario.model.js";
import Producto from "../models/producto.model.js";

const validarProducto = async (idProducto) => {
    if (!isValidObjectId(idProducto)) {
        const errorId = new Error("El id del producto no es válido");
        errorId.status = 400;
        throw errorId;
    }
    const producto = await Producto.findById(idProducto);
    if (!producto) {
        const errorNotFound = new Error("Producto no encontrado");
        errorNotFound.status = 404;
        throw errorNotFound;
    }
}

export const obtenerFavoritosService = async (idUsuario) => {
    const usuario = await Usuario.findById(idUsuario).populate({
        path: "favoritos",
        populate: [
            { path: "categoria", select: "nombre" },
            { path: "vendedor", select: "nombre apellido" }
        ]
    });
    return usuario.favoritos.filter(producto => producto !== null);
}

export const agregarFavoritoService = async (idUsuario, idProducto) => {
    await validarProducto(idProducto);
    // $addToSet no lo repite
    const usuario = await Usuario.findByIdAndUpdate(idUsuario, { $addToSet: { favoritos: idProducto } }, { returnDocument: 'after' });
    return usuario.favoritos;
}

export const quitarFavoritoService = async (idUsuario, idProducto) => {
    if (!isValidObjectId(idProducto)) {
        const errorId = new Error("El id del producto no es válido");
        errorId.status = 400;
        throw errorId;
    }
    const usuario = await Usuario.findByIdAndUpdate(idUsuario, { $pull: { favoritos: idProducto } }, { returnDocument: 'after' });
    return usuario.favoritos;
}
