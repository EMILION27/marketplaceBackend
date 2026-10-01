import express from "express";
import { generarDescripcion } from "../controllers/ai.controllers.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { generarDescripcionSchema } from "../validators/ai.validators.js";

const router = express.Router({ mergeParams: true });

router.post("/descripcion", validateBodyMiddleware(generarDescripcionSchema), generarDescripcion);

export default router;