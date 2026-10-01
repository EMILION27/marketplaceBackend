import express from "express";
import { obtenerPerfil, cambiarPlan, recargarSaldo } from "../controllers/usuarios.controllers.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { recargarSaldoSchema } from "../validators/usuarios.validators.js";
import { limiterSaldo } from "../middlewares/rateLimit.middleware.js";
import { obtenerMisCompras } from "../controllers/compras.controllers.js";

const router = express.Router({ mergeParams: true });

router.get("/me", obtenerPerfil);
router.get("/me/compras", obtenerMisCompras);
router.patch("/me/plan", cambiarPlan);
router.patch("/me/saldo",limiterSaldo, validateBodyMiddleware(recargarSaldoSchema), recargarSaldo);

export default router;