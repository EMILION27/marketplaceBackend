import { upload } from "../middlewares/multer.middleware.js";
import cloudinary from "../config/cloudinary.js";
import { runMulterSingle } from "../utils/multer.util.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.util.js";

export const subirImagenCloudinary = async (req, res) => {
    try {
        await runMulterSingle(upload, "imagen", req, res);

        if (!req.file) {
            return res.status(400).json({ error: "No se subió ningún archivo" });
        }

        const folder = req.body?.folder || "uploads";

        const result = await uploadBufferToCloudinary(cloudinary, req.file.buffer, {
            resource_type: "auto",
            folder,
        });

        return res.json({ url: result.secure_url, folder: result.folder });
    } catch (error) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "La imagen no puede pesar más de 5 MB" });
        }
        if (error.status === 400) {
            return res.status(400).json({ error: error.message });
        }
        console.error("Error al subir imagen:", error);
        return res.status(500).json({ error: "Error al subir imagen" });
    }
};