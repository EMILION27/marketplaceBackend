import express from "express";
import { pagarCarrito } from "../controllers/compras.controllers.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { pagarCarritoSchema } from "../validators/compras.validators.js";
import { limiterCompra } from "../middlewares/rateLimit.middleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", limiterCompra, validateBodyMiddleware(pagarCarritoSchema), pagarCarrito);

export default router;
