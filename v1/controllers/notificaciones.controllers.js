import { obtenerNotificacionesService, marcarLeidasService } from "../services/notificaciones.services.js";

export const obtenerNotificaciones = async (req, res) => {
    const notificaciones = await obtenerNotificacionesService(req.user.id);
    res.status(200).json({ notificaciones });
}

export const marcarLeidas = async (req, res) => {
    await marcarLeidasService(req.user.id);
    res.status(200).json({ message: "Notificaciones marcadas como leídas" });
}
