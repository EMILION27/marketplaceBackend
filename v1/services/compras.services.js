import mongoose from "mongoose";
import Compra from "../models/compra.model.js";
import Producto from "../models/producto.model.js";
import Usuario from "../models/usuario.model.js";
import Notificacion from "../models/notificacion.model.js";

// Paga todo el carrito de una vez (pago simulado con tarjeta).
// items: [{ producto, cantidad }]. Los precios salen de la base, nunca del cliente.
export const pagarCarritoService = async (idComprador, items) => {

    // 1. Revisar todo ANTES de tocar nada
    const productos = await Producto.find({ _id: { $in: items.map(i => i.producto) } });

    for (const item of items) {
        const producto = productos.find(p => String(p._id) === item.producto);
        if (!producto) {
            const errorNotFound = new Error("Uno de los productos del carrito ya no existe");
            errorNotFound.status = 404;
            throw errorNotFound;
        }
        if (String(producto.vendedor) === String(idComprador)) {
            const errorPropio = new Error(`No podés comprar tu propio producto ("${producto.titulo}")`);
            errorPropio.status = 403;
            throw errorPropio;
        }
        if (producto.stock < item.cantidad) {
            const errorStock = new Error(producto.stock === 0
                ? `"${producto.titulo}" está agotado`
                : `De "${producto.titulo}" solo quedan ${producto.stock} unidades`);
            errorStock.status = 409;
            throw errorStock;
        }
    }

    // 2. Descontar el stock de cada producto, solo si alcanza (igual que el cajero: en un solo paso).
    //    Si alguno falla en el medio, se devuelve el stock que ya se había descontado.
    const descontados = [];
    for (const item of items) {
        const productoActualizado = await Producto.findOneAndUpdate(
            { _id: item.producto, stock: { $gte: item.cantidad } },
            { $inc: { stock: -item.cantidad } },
            { returnDocument: 'after' }
        );
        if (!productoActualizado) {
            for (const descontado of descontados) {
                await Producto.findByIdAndUpdate(descontado.producto, { $inc: { stock: descontado.cantidad } });
            }
            const producto = productos.find(p => String(p._id) === item.producto);
            const errorStock = new Error(`"${producto.titulo}" se quedó sin stock suficiente mientras pagabas`);
            errorStock.status = 409;
            throw errorStock;
        }
        descontados.push(item);
    }

    // 3. Guardar una compra por producto, todas con el mismo número de pedido
    const pedido = new mongoose.Types.ObjectId();
    const compras = items.map(item => {
        const producto = productos.find(p => String(p._id) === item.producto);
        const precioUnitario = producto.precioFinal ?? producto.precio;
        return {
            producto: producto._id,
            comprador: idComprador,
            vendedor: producto.vendedor,
            titulo: producto.titulo,
            precioUnitario,
            descuento: producto.descuento || 0,
            cantidad: item.cantidad,
            total: precioUnitario * item.cantidad,
            pedido
        };
    });
    const comprasGuardadas = await Compra.insertMany(compras);

    // 4. Sumarle a cada vendedor lo que vendió (queda como "ganancias")
    for (const compra of compras) {
        await Usuario.findByIdAndUpdate(compra.vendedor, { $inc: { saldo: compra.total } });
    }

    // 5. Avisarle a cada vendedor que vendió
    const comprador = await Usuario.findById(idComprador).select("nombre apellido");
    const notificaciones = compras.map(compra => ({
        usuario: compra.vendedor,
        mensaje: `Vendiste ${compra.cantidad} x "${compra.titulo}" a ${comprador.nombre} ${comprador.apellido}`
    }));
    await Notificacion.insertMany(notificaciones);

    const total = compras.reduce((suma, compra) => suma + compra.total, 0);
    return { pedido, total, compras: comprasGuardadas };
}

export const obtenerMisComprasService = async (idUsuario) => {
    const compras = await Compra.find({ comprador: idUsuario })
        .sort({ createdAt: -1 })
        .populate("producto", "titulo imagen")
        .populate("vendedor", "nombre apellido");
    return compras;
}

export const obtenerMisVentasService = async (idUsuario) => {
    const ventas = await Compra.find({ vendedor: idUsuario })
        .sort({ createdAt: -1 })
        .populate("producto", "titulo imagen")
        .populate("comprador", "nombre apellido");
    return ventas;
}
