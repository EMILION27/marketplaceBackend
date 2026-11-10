import mongoose from "mongoose";

const notificacionSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    mensaje: {
        type: String,
        required: true
    },
    leida: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model("Notificacion", notificacionSchema, "notificaciones");
