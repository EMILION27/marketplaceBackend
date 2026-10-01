import { comprarProductoService, obtenerMisComprasService } from "../services/compras.services.js";

export const comprarProducto = async (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.validatedBody;
    const { compra, saldo } = await comprarProductoService(id, req.user.id, cantidad);
    res.status(201).json({ message: "Compra realizada", compra, saldo });
}

export const obtenerMisCompras = async (req, res) => {
    const compras = await obtenerMisComprasService(req.user.id);
    res.status(200).json({ compras });
}