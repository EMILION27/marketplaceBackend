import { isValidObjectId } from "mongoose";
import Compra from "../models/compra.model.js";
import Producto from "../models/producto.model.js";
import Usuario from "../models/usuario.model.js";

export const comprarProductoService = async (idProducto, idComprador, cantidad) => {
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
    if (String(producto.vendedor) === String(idComprador)) {
        const errorPropio = new Error("No podés comprar tu propio producto");
        errorPropio.status = 403;
        throw errorPropio;
    }
    if (producto.stock < cantidad) {
        const errorStock = new Error(producto.stock === 0 ? "Producto agotado" : `Solo quedan ${producto.stock} unidades disponibles`);
        errorStock.status = 409;
        throw errorStock;
    }

    const total = producto.precio * cantidad;

    const comprador = await Usuario.findOneAndUpdate(
        { _id: idComprador, saldo: { $gte: total } },
        { $inc: { saldo: -total } },
        { returnDocument: 'after' }
    );
    if (!comprador) {
        const errorSaldo = new Error("Saldo insuficiente");
        errorSaldo.status = 409;
        throw errorSaldo;
    }

    const productoActualizado = await Producto.findOneAndUpdate(
        { _id: idProducto, stock: { $gte: cantidad } },
        { $inc: { stock: -cantidad } },
        { returnDocument: 'after' }
    );
    if (!productoActualizado) {
        await Usuario.findByIdAndUpdate(idComprador, { $inc: { saldo: total } });
        const errorStock = new Error("Producto agotado");
        errorStock.status = 409;
        throw errorStock;
    }

    await Usuario.findByIdAndUpdate(producto.vendedor, { $inc: { saldo: total } });

    const nuevaCompra = new Compra({
        producto: idProducto,
        comprador: idComprador,
        vendedor: producto.vendedor,
        titulo: producto.titulo,
        precioUnitario: producto.precio,
        cantidad,
        total
    });
    await nuevaCompra.save();

    return { compra: nuevaCompra, saldo: comprador.saldo };
}

export const obtenerMisComprasService = async (idUsuario) => {
    const compras = await Compra.find({ comprador: idUsuario })
        .populate("producto", "titulo imagen")
        .populate("vendedor", "nombre apellido");
    return compras;
}