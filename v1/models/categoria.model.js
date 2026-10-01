import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    }
});

export default mongoose.model("Categoria", categoriaSchema, "categorias");
