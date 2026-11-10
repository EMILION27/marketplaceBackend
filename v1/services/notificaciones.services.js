import Notificacion from "../models/notificacion.model.js";

export const obtenerNotificacionesService = async (idUsuario) => {
    const notificaciones = await Notificacion.find({ usuario: idUsuario })
        .sort({ createdAt: -1 })
        .limit(20);
    return notificaciones;
}

export const marcarLeidasService = async (idUsuario) => {
    await Notificacion.updateMany({ usuario: idUsuario, leida: false }, { leida: true });
}
