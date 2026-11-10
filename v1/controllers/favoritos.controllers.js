import { obtenerFavoritosService, agregarFavoritoService, quitarFavoritoService } from "../services/favoritos.services.js";

export const obtenerFavoritos = async (req, res) => {
    const favoritos = await obtenerFavoritosService(req.user.id);
    res.status(200).json({ favoritos });
}

export const agregarFavorito = async (req, res) => {
    const { idProducto } = req.params;
    const favoritos = await agregarFavoritoService(req.user.id, idProducto);
    res.status(200).json({ message: "Agregado a favoritos", favoritos });
}

export const quitarFavorito = async (req, res) => {
    const { idProducto } = req.params;
    const favoritos = await quitarFavoritoService(req.user.id, idProducto);
    res.status(200).json({ message: "Quitado de favoritos", favoritos });
}
