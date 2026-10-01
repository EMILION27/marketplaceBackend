import express from "express";
import { obtenerCotizacion } from "../controllers/cotizacion.controllers.js";

const router = express.Router({ mergeParams: true });

router.get("/", obtenerCotizacion);

export default router;


