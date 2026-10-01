import { isValidObjectId } from "mongoose";
import Producto from "../models/producto.model.js";
import Categoria from "../models/categoria.model.js";
import Usuario from "../models/usuario.model.js";

const limitePlanPlus = 4;


const armarCriterio = ({ categoria, titulo, precioMin, precioMax }) => {
    const criterio = {};
     if (categoria) {
        if (!isValidObjectId(categoria)) {
            const errorCategoria = new Error("El id de la categoría no es válido");
            errorCategoria.status = 400;
            throw errorCategoria;
        }
        criterio.categoria = categoria;
    }
     if (titulo) {
        const tituloSeguro = String(titulo).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        criterio.titulo = { $regex: tituloSeguro, $options: "i" };
    }
    if (precioMin || precioMax) {
        criterio.precio = {};
        if (precioMin) criterio.precio.$gte = Number(precioMin);
        if (precioMax) criterio.precio.$lte = Number(precioMax);
    }
    return criterio;
}

export const obtenerProductosService = async (busqueda) => {
    let { limit = 10, page = 1, ...filtros } = busqueda;
    limit = Number(limit);
    page = Number(page);
    if (!Number.isInteger(limit) || limit < 1) limit = 10;
    if (limit > 50) limit = 50; 
    if (!Number.isInteger(page) || page < 1) page = 1;
    let skip = (page - 1) * limit;
    const criterio = armarCriterio(filtros);
    const productos = await Producto.find(criterio)
        .skip(skip)
        .limit(limit)
        .populate("categoria", "nombre")
        .populate("vendedor", "nombre apellido");
    const productosTotales = await Producto.countDocuments(criterio);
    const totalPages = Math.ceil(productosTotales / limit);
    return {
        productos,
        totalPages,
        currentPage: page
    };
}

export const obtenerMisProductosService = async (idUsuario) => {
    const productos = await Producto.find({ vendedor: idUsuario }).populate("categoria", "nombre");
    return productos;
}

export const obtenerProductoService = async (id) => {
    if (!isValidObjectId(id)) {
        const errorId = new Error("El id del producto no es válido");
        errorId.status = 400;
        throw errorId;
    }
    const producto = await Producto.findById(id)
        .populate("categoria", "nombre")
        .populate("vendedor", "nombre apellido");
    if (!producto) {
        const errorNotFound = new Error("Producto no encontrado");
        errorNotFound.status = 404;
        throw errorNotFound;
    }
    return producto;
}
export const guardarProductoService = async (productoData, idUsuario) => {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
        const errorNotFound = new Error("Usuario no encontrado");
        errorNotFound.status = 404;
        throw errorNotFound;
    }

    if (usuario.plan === "plus") {
        const cantidadProductos = await Producto.countDocuments({ vendedor: idUsuario });
        if (cantidadProductos >= limitePlanPlus) {
            const errorLimite = new Error(`El plan plus permite hasta ${limitePlanPlus} publicaciones. Pasate a premium para publicar más`);
            errorLimite.status = 403;
            throw errorLimite;
        }
    }

    const categoria = await Categoria.findById(productoData.categoria);
    if (!categoria) {
        const errorCategoria = new Error("La categoría no existe");
        errorCategoria.status = 404;
        throw errorCategoria;
    }

    const nuevoProducto = new Producto({ ...productoData, vendedor: idUsuario });
    await nuevoProducto.save();
    return nuevoProducto;
}


const buscarProductoPropio = async (id, usuarioToken) => {
    if (!isValidObjectId(id)) {
        const errorId = new Error("El id del producto no es válido");
        errorId.status = 400;
        throw errorId;
    }
    const producto = await Producto.findById(id);
    if (!producto) {
        const errorNotFound = new Error("Producto no encontrado");
        errorNotFound.status = 404;
        throw errorNotFound;
    }
    if (String(producto.vendedor) !== String(usuarioToken.id) && usuarioToken.rol !== "admin") {
        const errorPermiso = new Error("No podés modificar ni eliminar un producto que no es tuyo");
        errorPermiso.status = 403;
        throw errorPermiso;
    }
    return producto;
}

export const actualizarProductoService = async (id, productoData, usuarioToken) => {
    await buscarProductoPropio(id, usuarioToken);
    if (productoData.categoria) {
        const categoria = await Categoria.findById(productoData.categoria);
        if (!categoria) {
            const errorCategoria = new Error("La categoría no existe");
            errorCategoria.status = 404;
            throw errorCategoria;
        }
    }
    const productoActualizado = await Producto.findByIdAndUpdate(id, productoData, { returnDocument: 'after' });
    return productoActualizado;
}

export const eliminarProductoService = async (id, usuarioToken) => {
    await buscarProductoPropio(id, usuarioToken);
    const productoEliminado = await Producto.findByIdAndDelete(id);
    return productoEliminado;
}