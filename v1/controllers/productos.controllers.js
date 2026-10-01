import { obtenerProductosService, obtenerMisProductosService, obtenerProductoService,
    guardarProductoService, actualizarProductoService, eliminarProductoService } from "../services/productos.services.js";

export const obtenerProductos = async (req, res) => {
    const busqueda = req.query; //preguntar si ta bien la parte de filtro
    const resultado = await obtenerProductosService(busqueda);
    res.status(200).json(resultado);
}

export const obtenerMisProductos = async (req, res) => {
    const productos = await obtenerMisProductosService(req.user.id);
    res.status(200).json({ productos });
}

export const obtenerProducto = async (req, res) => {
    const { id } = req.params;
    const producto = await obtenerProductoService(id);
    res.status(200).json({ producto });
}

export const guardarProducto = async (req, res) => {
    const nuevoProducto = await guardarProductoService(req.validatedBody, req.user.id);
    res.status(201).json({ producto: nuevoProducto });
}

export const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const productoActualizado = await actualizarProductoService(id, req.validatedBody, req.user);
    res.status(200).json({ producto: productoActualizado });
}

export const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    const productoEliminado = await eliminarProductoService(id, req.user);
    res.status(200).json({ producto: productoEliminado });
}