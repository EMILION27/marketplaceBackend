import express from "express";
import { subirImagenCloudinary } from "../controllers/uploads.controllers.js";

const router = express.Router({ mergeParams: true });

router.post("/cloudinary", subirImagenCloudinary);

export default router;