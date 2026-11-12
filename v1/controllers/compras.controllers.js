import { pagarCarritoService, obtenerMisComprasService, obtenerMisVentasService } from "../services/compras.services.js";

export const pagarCarrito = async (req, res) => {
    // la tarjeta solo se valida, no se guarda
    const { items } = req.validatedBody;
    const { pedido, total, compras } = await pagarCarritoService(req.user.id, items);
    res.status(201).json({ message: "Pago aprobado (simulado). Compra realizada", pedido, total, compras });
}

export const obtenerMisCompras = async (req, res) => {
    const compras = await obtenerMisComprasService(req.user.id);
    res.status(200).json({ compras });
}

export const obtenerMisVentas = async (req, res) => {
    const ventas = await obtenerMisVentasService(req.user.id);
    res.status(200).json({ ventas });
}
