import mongoose from "mongoose";

const cotizacionSchema = new mongoose.Schema({
    moneda: {
        type: String,
        required: true,
        unique: true
    },
    compra: {
        type: Number,
        required: true
    },
    venta: {
        type: Number,
        required: true
    },
    fechaActualizacion: {
        type: Date,
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Cotizacion", cotizacionSchema, "cotizaciones");
