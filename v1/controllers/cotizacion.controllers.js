import { obtenerCotizacionService } from "../services/cotizacion.services.js";

export const obtenerCotizacion = async (req, res) => {
    const cotizacion = await obtenerCotizacionService();
    res.json({ cotizacion });
}