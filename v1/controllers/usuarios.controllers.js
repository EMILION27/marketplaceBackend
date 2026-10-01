import { obtenerPerfilService, cambiarPlanService, recargarSaldoService } from "../services/usuarios.services.js";

export const obtenerPerfil = async (req, res) => {
    const usuario = await obtenerPerfilService(req.user.id);
    res.status(200).json({ usuario });
}

export const cambiarPlan = async (req, res) => {
    const usuario = await cambiarPlanService(req.user.id);
    res.status(200).json({ message: "Plan actualizado a premium", usuario });
}

export const recargarSaldo = async (req, res) => {
    const { monto } = req.validatedBody;
    const usuario = await recargarSaldoService(req.user.id, monto);
    res.status(200).json({ message: "Saldo recargado", usuario });
}