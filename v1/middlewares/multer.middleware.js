import multer from "multer";
const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // maximo 5 MB
    fileFilter: (req, file, cb) => {
        // solo aceptamos imagenes (png, jpg, webp, etc.)
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            const errorTipo = new Error("Solo se permiten imágenes");
            errorTipo.status = 400;
            cb(errorTipo);
        }
    }
});