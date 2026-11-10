import { obtenerResumenService } from "../services/admin.services.js";

export const obtenerResumen = async (req, res) => {
    const resumen = await obtenerResumenService();
    res.status(200).json({ resumen });
}
