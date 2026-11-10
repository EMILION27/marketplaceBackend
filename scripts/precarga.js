// Script de precarga ("seed"): carga vendedores, categorías y productos de ejemplo con sus fotos.
// Se corre a mano, una vez: npm run seed
// Las fotos van en scripts/imagenes/ (no se suben a GitHub). Se suben a Cloudinary y en Mongo queda la URL.
import "dotenv/config";
import fs from "fs";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../v1/config/db.config.js";
import cloudinary from "../v1/config/cloudinary.js";
import { uploadBufferToCloudinary } from "../v1/utils/cloudinary.util.js";
import Usuario from "../v1/models/usuario.model.js";
import Categoria from "../v1/models/categoria.model.js";
import Producto from "../v1/models/producto.model.js";

const carpetaImagenes = "scripts/imagenes";
const passwordVendedores = "Prueba123";

// Vendedores de prueba (premium, para que puedan tener más de 4 productos)
const vendedores = [
    { nombre: "Martín", apellido: "Pérez", email: "tienda1@test.com" },
    { nombre: "Sofía", apellido: "Rodríguez", email: "tienda2@test.com" },
    { nombre: "Lucía", apellido: "Gómez", email: "tienda3@test.com" },
    { nombre: "Diego", apellido: "Fernández", email: "tienda4@test.com" },
];

// Productos de ejemplo. vendedor = posición en la lista de arriba (0, 1, 2 o 3)
// imagen = nombre del archivo en scripts/imagenes/
const productos = [
    {
        titulo: "Auriculares inalámbricos Bluetooth",
        precio: 1890, descuento: 0, stock: 12,
        categoria: "Electrónica", vendedor: 0, imagen: "auriculares.jpg",
        descripcion: "Auriculares inalámbricos con Bluetooth 5.0, hasta 30 horas de batería y almohadillas cómodas para uso diario."
    },
    // ... la lista completa se arma con las fotos
];

const calcularPrecioFinal = (precio, descuento = 0) => Math.round(precio * (100 - descuento) / 100);

const subirImagen = async (archivo) => {
    const ruta = `${carpetaImagenes}/${archivo}`;
    if (!fs.existsSync(ruta)) {
        console.log(`   ⚠ No encontré la foto ${archivo}: el producto queda sin imagen`);
        return undefined;
    }
    const buffer = fs.readFileSync(ruta);
    const result = await uploadBufferToCloudinary(cloudinary, buffer, { folder: "productos" });
    return result.secure_url;
}

const precarga = async () => {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
        console.error("No se pudo conectar a la base de datos. Revisá el .env y que el cluster de Atlas no esté pausado.");
        process.exit(1);
    }

    // 1. Vendedores: si no existen, se crean
    console.log("1. Vendedores");
    const idsVendedores = [];
    for (const datos of vendedores) {
        let vendedor = await Usuario.findOne({ email: datos.email });
        if (!vendedor) {
            const password = bcrypt.hashSync(passwordVendedores, Number(process.env.SALTING_ROUNDS));
            vendedor = new Usuario({ ...datos, password, plan: "premium" });
            await vendedor.save();
            console.log(`   + ${datos.email}`);
        }
        idsVendedores.push(vendedor._id);
    }

    // 2. Categorías: si no existen, se crean
    console.log("2. Categorías");
    const idsCategorias = {};
    for (const nombre of new Set(productos.map(p => p.categoria))) {
        let categoria = await Categoria.findOne({ nombre });
        if (!categoria) {
            categoria = new Categoria({ nombre });
            await categoria.save();
            console.log(`   + ${nombre}`);
        }
        idsCategorias[nombre] = categoria._id;
    }

    // 3. Se borran los productos anteriores de los vendedores de prueba (así no se duplican)
    const borrados = await Producto.deleteMany({ vendedor: { $in: idsVendedores } });
    console.log(`3. Productos de prueba anteriores borrados: ${borrados.deletedCount}`);

    // 4. Productos: se sube cada foto a Cloudinary y se guarda el producto con la URL
    console.log("4. Productos");
    for (const datos of productos) {
        const imagen = await subirImagen(datos.imagen);
        const producto = new Producto({
            titulo: datos.titulo,
            precio: datos.precio,
            descuento: datos.descuento,
            precioFinal: calcularPrecioFinal(datos.precio, datos.descuento),
            stock: datos.stock,
            descripcion: datos.descripcion,
            imagen,
            categoria: idsCategorias[datos.categoria],
            vendedor: idsVendedores[datos.vendedor]
        });
        await producto.save();
        console.log(`   + ${datos.titulo}`);
    }

    // 5. Los productos viejos (de antes del descuento) reciben su precio final
    const viejos = await Producto.find({ precioFinal: { $exists: false } });
    for (const producto of viejos) {
        producto.precioFinal = calcularPrecioFinal(producto.precio, producto.descuento);
        await producto.save();
    }
    console.log(`5. Productos viejos actualizados con precio final: ${viejos.length}`);

    console.log("Precarga terminada");
    await mongoose.disconnect();
}

precarga();
