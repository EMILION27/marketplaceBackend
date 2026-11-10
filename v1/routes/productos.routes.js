import express from "express";
import { obtenerProductos, obtenerMisProductos, obtenerProducto, guardarProducto, actualizarProducto, eliminarProducto } from "../controllers/productos.controllers.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { agregarProductoSchema, actualizarProductoSchema } from "../validators/productos.validators.js";

const router = express.Router({ mergeParams: true });

router.get("/", obtenerProductos);
router.get("/mios", obtenerMisProductos);
router.get("/:id", obtenerProducto);
router.post("/", validateBodyMiddleware(agregarProductoSchema), guardarProducto);
router.patch("/:id", validateBodyMiddleware(actualizarProductoSchema), actualizarProducto);
router.delete("/:id", eliminarProducto);

export default router;