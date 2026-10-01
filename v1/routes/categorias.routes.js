import express from "express";
import { obtenerCategorias, guardarCategoria, actualizarCategoria, eliminarCategoria } from "../controllers/categorias.controllers.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { categoriaSchema } from "../validators/categorias.validators.js";

const router = express.Router({ mergeParams: true });

// Ver categorias: cualquier usuario logueado
router.get("/", obtenerCategorias);

router.post("/", authorizeRoles(["admin"]), validateBodyMiddleware(categoriaSchema), guardarCategoria);
router.patch("/:id", authorizeRoles(["admin"]), validateBodyMiddleware(categoriaSchema), actualizarCategoria);
router.delete("/:id", authorizeRoles(["admin"]), eliminarCategoria);

export default router;