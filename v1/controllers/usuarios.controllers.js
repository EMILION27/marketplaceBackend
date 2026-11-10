import { obtenerPerfilService, cambiarPlanService, editarPerfilService, obtenerPerfilPublicoService } from "../services/usuarios.services.js";

export const obtenerPerfil = async (req, res) => {
    const usuario = await obtenerPerfilService(req.user.id);
    res.status(200).json({ usuario });
}

export const cambiarPlan = async (req, res) => {
    // De la tarjeta solo se valida que esté bien (Joi): no se pasa al service ni se guarda
    const { usuario, precio } = await cambiarPlanService(req.user.id);
    res.status(200).json({ message: `Pago de $U ${precio} aprobado (simulado). Plan actualizado a premium`, usuario });
}

export const editarPerfil = async (req, res) => {
    const usuario = await editarPerfilService(req.user.id, req.validatedBody);
    res.status(200).json({ message: "Perfil actualizado", usuario });
}

export const obtenerPerfilPublico = async (req, res) => {
    const { id } = req.params;
    const { usuario, productos } = await obtenerPerfilPublicoService(id);
    res.status(200).json({ usuario, productos });
}
