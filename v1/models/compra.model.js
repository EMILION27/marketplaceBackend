import mongoose from "mongoose";

const compraSchema = new mongoose.Schema({
    producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
    comprador: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    vendedor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    titulo: {
        type: String,
        required: true      
    },
    precioUnitario: {
        type: Number,
        required: true,
        min: 0           // precio realmente pagado (con descuento si tenía)
    },
    descuento: {
        type: Number,
        default: 0       // descuento que tenía el producto al momento de comprar
    },
    pedido: {
        type: mongoose.Schema.Types.ObjectId,
        required: true   // agrupa los productos que se pagaron juntos (un mismo carrito)
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1
    },
    total: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

export default mongoose.model("Compra", compraSchema, "compras");