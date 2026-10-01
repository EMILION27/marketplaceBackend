import { isValidObjectId } from "mongoose";
import Categoria from "../models/categoria.model.js";
import Producto from "../models/producto.model.js";

export const obtenerCategoriasService = async () => {
    const categorias = await Categoria.find();
    return categorias;
}

export const guardarCategoriaService = async (categoriaData) => {
    const categoriaExistente = await Categoria.findOne({ nombre: categoriaData.nombre });
    if (categoriaExistente) {
        const errorExiste = new Error("Ya existe una categoría con ese nombre");
        errorExiste.status = 409;
        throw errorExiste;
    }
    const nuevaCategoria = new Categoria(categoriaData);
    await nuevaCategoria.save();
    return nuevaCategoria;
}

export const actualizarCategoriaService = async (id, categoriaData) => {
    if (!isValidObjectId(id)) {
        const errorId = new Error("El id de la categoría no es válido");
        errorId.status = 400;
        throw errorId;
    }
    const categoriaActualizada = await Categoria.findByIdAndUpdate(id, categoriaData, { returnDocument: 'after' });
    if (!categoriaActualizada) {
        const errorNotFound = new Error("Categoría no encontrada");
        errorNotFound.status = 404;
        throw errorNotFound;
    }
    return categoriaActualizada;
}

export const eliminarCategoriaService = async (id) => {
    if (!isValidObjectId(id)) {
        const errorId = new Error("El id de la categoría no es válido");
        errorId.status = 400;
        throw errorId;
    }
  
    const cantidadProductos = await Producto.countDocuments({ categoria: id });
    if (cantidadProductos > 0) {
        const errorConProductos = new Error("No se puede eliminar una categoría que tiene productos asociados");
        errorConProductos.status = 409;
        throw errorConProductos;
    }
    const categoriaEliminada = await Categoria.findByIdAndDelete(id);
    if (!categoriaEliminada) {
        const errorNotFound = new Error("Categoría no encontrada");
        errorNotFound.status = 404;
        throw errorNotFound;
    }
    return categoriaEliminada;
}
