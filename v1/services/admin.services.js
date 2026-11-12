import Usuario from "../models/usuario.model.js";
import Categoria from "../models/categoria.model.js";
import Producto from "../models/producto.model.js";

export const obtenerResumenService = async () => {
    const usuarios = await Usuario.countDocuments({ rol: "usuario" });
    const productos = await Producto.countDocuments();
    const conStock = await Producto.countDocuments({ stock: { $gt: 0 } });
    const categorias = await Categoria.find();

    const productosPorCategoria = [];
    for (const categoria of categorias) {
        const cantidad = await Producto.countDocuments({ categoria: categoria._id });
        productosPorCategoria.push({ nombre: categoria.nombre, cantidad });
    }
    productosPorCategoria.sort((a, b) => b.cantidad - a.cantidad);

    return {
        usuarios,
        categorias: categorias.length,
        productos,
        conStock,
        productosPorCategoria
    };
}
