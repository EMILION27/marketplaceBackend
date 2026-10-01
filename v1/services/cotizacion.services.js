import axios from "axios";
import Cotizacion from "../models/cotizacion.model.js";

export const obtenerCotizacionService = async () => {
  try {
    const url = "https://uy.dolarapi.com/v1/cotizaciones/usd";
    const response = await axios.get(url, { timeout: 5000 });
    const { compra, venta, fechaActualizacion } = response.data;
    if (
      typeof compra !== "number" ||
      typeof venta !== "number" ||
      !fechaActualizacion
    ) {
    throw new Error("DolarApi devolvio datos con un formato invalido");
    }

    await Cotizacion.findOneAndUpdate(
      { moneda: "USD" },
      { compra, venta, fechaActualizacion },
      { upsert: true },
    );
    return { compra, venta, fechaActualizacion, desactualizada: false };
  } catch (error) {
    console.error("DolarApi falló, usamos la última guardada:", error.message);

    const ultima = await Cotizacion.findOne({ moneda: "USD" });
    if (!ultima) {
      const errorCotizacion = new Error(
        "No se pudo obtener la cotización en este momento",
      );
      errorCotizacion.status = 503;
      throw errorCotizacion;
    }
    return {
      compra: ultima.compra,
      venta: ultima.venta,
      fechaActualizacion: ultima.fechaActualizacion,
      desactualizada: true,
    };
  }
};
