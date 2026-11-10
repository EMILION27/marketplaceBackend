import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ["usuario", "admin"],
        default: "usuario"
    },
    plan: {
        type: String,
        enum: ["plus", "premium"],
        default: "plus"
    },
    saldo: {
        type: Number,
        default: 0     
    },
    foto: {
        type: String,
        default: "https://res.cloudinary.com/ihlugi3b/image/upload/v1790857971/avatarDefault.png"    // avatar por defecto (como el de Instagram)
    },
    // Datos del perfil público (opcionales)
    nombreUsuario: {
        type: String,
        unique: true,
        sparse: true,       // único, pero puede no tenerlo
        lowercase: true
    },
    descripcion: {
        type: String
    },
    redes: {
        instagram: { type: String },
        facebook: { type: String },
        sitioWeb: { type: String }
    },
    favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Producto" }]
}, { collection: "usuarios", timestamps: true });

export default mongoose.model("Usuario", usuarioSchema);
