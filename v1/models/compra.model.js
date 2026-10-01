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
        min: 0           
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