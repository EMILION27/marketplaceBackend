export const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) {
    console.error("Error interno:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
  res.status(status).json({ message: err.message });
};