import express from "express";
import { obtenerResumen } from "../controllers/admin.controllers.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const router = express.Router({ mergeParams: true });

router.get("/resumen", authorizeRoles(["admin"]), obtenerResumen);

export default router;
