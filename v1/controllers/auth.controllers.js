import { loginService, registerService } from "../services/auth.services.js";

export const login = async (req, res) => {
    const { email, password } = req.validatedBody; 
    const { token, usuario } = await loginService(email, password);
    res.status(200).json({ message: "Login exitoso", token, usuario });
}

export const register = async (req, res) => {
    const { token, usuario } = await registerService(req.validatedBody);
    res.status(201).json({ message: "Usuario registrado exitosamente", token, usuario });
}


