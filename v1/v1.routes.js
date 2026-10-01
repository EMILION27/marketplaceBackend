import { authenticateToken } from "./middlewares/authorization.middleware.js";
import express from "express";
import authRouter from "./routes/auth.routes.js";
import productosRouter from "./routes/productos.routes.js";
import categoriasRouter from "./routes/categorias.routes.js";
import usuariosRouter from "./routes/usuarios.routes.js";
import cotizacionRouter from "./routes/cotizacion.routes.js";
import uploadsRouter from "./routes/uploads.routes.js";
import aiRouter from "./routes/ai.routes.js";


const router = express.Router({ mergeParams: true });

router.use("/auth", authRouter);

router.use(authenticateToken); 

router.use("/productos", productosRouter);
router.use("/categorias", categoriasRouter);
router.use("/usuarios", usuariosRouter);
router.use("/cotizacion", cotizacionRouter);
router.use("/uploads", uploadsRouter);
router.use("/ai", aiRouter);

export default router;
