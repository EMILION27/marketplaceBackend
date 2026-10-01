import { generarDescripcionService } from "../services/ai.services.js";

export const generarDescripcion = async (req, res) => {
    const { titulo, categoria } = req.validatedBody;
    const resultado = await generarDescripcionService(titulo, categoria);
    res.status(200).json(resultado);
}