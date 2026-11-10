import express from "express";
import { obtenerPerfil, cambiarPlan, editarPerfil, obtenerPerfilPublico } from "../controllers/usuarios.controllers.js";
import { obtenerMisCompras, obtenerMisVentas } from "../controllers/compras.controllers.js";
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from "../controllers/favoritos.controllers.js";
import { obtenerNotificaciones, marcarLeidas } from "../controllers/notificaciones.controllers.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { cambiarPlanSchema, editarPerfilSchema } from "../validators/usuarios.validators.js";
import { limiterPlan } from "../middlewares/rateLimit.middleware.js";

const router = express.Router({ mergeParams: true });

// Mi cuenta (siempre sobre el usuario del token)
router.get("/me", obtenerPerfil);
router.patch("/me", validateBodyMiddleware(editarPerfilSchema), editarPerfil);
router.get("/me/compras", obtenerMisCompras);
router.get("/me/ventas", obtenerMisVentas);
router.patch("/me/plan", limiterPlan, validateBodyMiddleware(cambiarPlanSchema), cambiarPlan);

// Favoritos
router.get("/me/favoritos", obtenerFavoritos);
router.post("/me/favoritos/:idProducto", agregarFavorito);
router.delete("/me/favoritos/:idProducto", quitarFavorito);

// Notificaciones
router.get("/me/notificaciones", obtenerNotificaciones);
router.patch("/me/notificaciones/leidas", marcarLeidas);

// Perfil público de otro usuario (va al final para que no tape las rutas /me)
router.get("/:id", obtenerPerfilPublico);

export default router;
