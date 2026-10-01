import { obtenerCategoriasService, guardarCategoriaService,
    actualizarCategoriaService, eliminarCategoriaService } from "../services/categorias.services.js";

export const obtenerCategorias = async (req, res) => {
    const categorias = await obtenerCategoriasService();
    res.status(200).json({ categorias });
}

export const guardarCategoria = async (req, res) => {
    const nuevaCategoria = await guardarCategoriaService(req.validatedBody);
    res.status(201).json({ categoria: nuevaCategoria });
}

export const actualizarCategoria = async (req, res) => {
    const { id } = req.params;
    const categoriaActualizada = await actualizarCategoriaService(id, req.validatedBody);
    res.status(200).json({ categoria: categoriaActualizada });
}

export const eliminarCategoria = async (req, res) => {
    const { id } = req.params;
    const categoriaEliminada = await eliminarCategoriaService(id);
    res.status(200).json({ categoria: categoriaEliminada });
}
