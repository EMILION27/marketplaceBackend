import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    imagen: {
        type: String,
        required: false
    },
    descripcion: {
        type: String,
        required: false
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: "Categoria", required: true },
    vendedor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true }
}, { timestamps: true });

export default mongoose.model("Producto", productoSchema, "productos");