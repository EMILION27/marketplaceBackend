import { isValidObjectId } from "mongoose";
import Producto from "../models/producto.model.js";
import Categoria from "../models/categoria.model.js";
import Usuario from "../models/usuario.model.js";

const limitePlanPlus = 4;

// Precio con el descuento aplicado. Lo calcula siempre el backend: el cliente nunca manda el precio final
const calcularPrecioFinal = (precio, descuento = 0) => {
    return Math.round(precio * (100 - descuento) / 100);
}

// Para buscar texto con $regex sin que los símbolos especiales rompan la búsqueda
const escaparRegex = (texto) => String(texto).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Cómo ordenar el listado (por defecto, los más nuevos primero)
const ordenes = {
    recientes: { createdAt: -1, _id: -1 },
    menorPrecio: { precioFinal: 1, _id: -1 },
    mayorPrecio: { precioFinal: -1, _id: -1 }
};


const armarCriterio = ({ categoria, titulo, precioMin, precioMax, vendedor }) => {
    const criterio = {};
     if (categoria) {
        if (!isValidObjectId(categoria)) {
            const errorCategoria = new Error("El id de la categoría no es válido");
            errorCategoria.status = 400;
            throw errorCategoria;
        }
        criterio.categoria = categoria;
    }
    if (vendedor) {
        if (!isValidObjectId(vendedor)) {
            const errorVendedor = new Error("El id del vendedor no es válido");
            errorVendedor.status = 400;
            throw errorVendedor;
        }
        criterio.vendedor = vendedor;
    }
     if (titulo) {
        const tituloSeguro = escaparRegex(titulo);
        criterio.titulo = { $regex: tituloSeguro, $options: "i" };
    }
    if (precioMin || precioMax) {
        criterio.precioFinal = {};
        if (precioMin) criterio.precioFinal.$gte = Number(precioMin);
        if (precioMax) criterio.precioFinal.$lte = Number(precioMax);
    }
    return criterio;
}

export const obtenerProductosService = async (busqueda) => {
    let { limit = 10, page = 1, orden = "recientes", buscar, ...filtros } = busqueda;
    limit = Number(limit);
    page = Number(page);
    if (!Number.isInteger(limit) || limit < 1) limit = 10;
    if (limit > 50) limit = 50; 
    if (!Number.isInteger(page) || page < 1) page = 1;
    let skip = (page - 1) * limit;
    const criterio = armarCriterio(filtros);

    // "buscar" (tabla del admin): el texto puede estar en el título o en el nombre del vendedor
    if (buscar) {
        const buscarSeguro = escaparRegex(buscar);
        const vendedores = await Usuario.find({
            $or: [
                { nombre: { $regex: buscarSeguro, $options: "i" } },
                { apellido: { $regex: buscarSeguro, $options: "i" } }
            ]
        }).select("_id");
        criterio.$or = [
            { titulo: { $regex: buscarSeguro, $options: "i" } },
            { vendedor: { $in: vendedores.map(v => v._id) } }
        ];
    }

    const productos = await Producto.find(criterio)
        .sort(Object.hasOwn(ordenes, orden) ? ordenes[orden] : ordenes.recientes)
        .skip(skip)
        .limit(limit)
        .populate("categoria", "nombre")
        .populate("vendedor", "nombre apellido");
    const productosTotales = await Producto.countDocuments(criterio);
    const totalPages = Math.ceil(productosTotales / limit);
    return {
        productos,
        total: productosTotales,
        totalPages,
        currentPage: page
    };
}

export const obtenerMisProductosService = async (idUsuario) => {
    const productos = await Producto.find({ vendedor: idUsuario })
        .sort({ createdAt: -1 })
        .populate("categoria", "nombre");
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
        .populate("vendedor", "nombre apellido foto nombreUsuario");
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

    const precioFinal = calcularPrecioFinal(productoData.precio, productoData.descuento);
    const nuevoProducto = new Producto({ ...productoData, precioFinal, vendedor: idUsuario });
    await nuevoProducto.save();
    await nuevoProducto.populate("categoria", "nombre");
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
    const producto = await buscarProductoPropio(id, usuarioToken);
    if (productoData.categoria) {
        const categoria = await Categoria.findById(productoData.categoria);
        if (!categoria) {
            const errorCategoria = new Error("La categoría no existe");
            errorCategoria.status = 404;
            throw errorCategoria;
        }
    }
    // Si cambia el precio o el descuento, se recalcula el precio final
    const precio = productoData.precio ?? producto.precio;
    const descuento = productoData.descuento ?? producto.descuento;
    const precioFinal = calcularPrecioFinal(precio, descuento);

    const productoActualizado = await Producto.findByIdAndUpdate(id, { ...productoData, precioFinal }, { returnDocument: 'after' })
        .populate("categoria", "nombre");
    return productoActualizado;
}

export const eliminarProductoService = async (id, usuarioToken) => {
    await buscarProductoPropio(id, usuarioToken);
    const productoEliminado = await Producto.findByIdAndDelete(id);
    return productoEliminado;
}