// precarga de vendedores, categorias y productos de ejemplo. Se corre con npm run seed
// las fotos van en scripts/imagenes (no se suben a github)
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

// camila es plus y tiene 4 productos, para mostrar el limite
const vendedores = [
    { nombre: "Martín", apellido: "Pérez", email: "martin@test.com", plan: "premium" },        // 0: Tecnología
    { nombre: "Sofía", apellido: "Rodríguez", email: "sofia@test.com", plan: "premium" },      // 1: Hogar y Herramientas
    { nombre: "Lucía", apellido: "Gómez", email: "lucia@test.com", plan: "premium" },          // 2: Moda y Belleza
    { nombre: "Diego", apellido: "Fernández", email: "diego@test.com", plan: "premium" },      // 3: Deportes y Juguetes
    { nombre: "Valentina", apellido: "Silva", email: "valentina@test.com", plan: "premium" },  // 4: Libros y Otros
    { nombre: "Nicolás", apellido: "Castro", email: "nicolas@test.com", plan: "premium" },     // 5: Mascotas
    { nombre: "Camila", apellido: "Torres", email: "camila@test.com", plan: "plus" },          // 6: 4 productos variados
];

const usuariosViejos = ["tienda1@test.com", "tienda2@test.com", "tienda3@test.com", "tienda4@test.com"];

const categorias = ["Tecnología", "Hogar", "Herramientas", "Belleza", "Moda", "Deportes", "Juguetes", "Mascotas", "Libros", "Otros"];

// vendedor: posicion en la lista de vendedores de arriba
const productos = [
    {
        titulo: "Apple iPhone 17 Color Azul Claro",
        precio: 42990, descuento: 10, stock: 8,
        categoria: "Tecnología", vendedor: 0, imagen: "iphone-17-azul.png",
        descripcion: "Smartphone Apple iPhone en elegante color azul claro, con diseño de bordes redondeados, pantalla frontal de gran tamaño y doble cámara trasera. Ideal para disfrutar de tus aplicaciones, sacar fotos y mantenerte conectado todos los días."
    },
    {
        titulo: "Teclado Logitech K120 USB en Español",
        precio: 890, descuento: 0, stock: 25,
        categoria: "Tecnología", vendedor: 0, imagen: "teclado-logitech-k120.png",
        descripcion: "Teclado Logitech K120 de diseño clásico en color negro, con distribución completa de teclas y teclado numérico. Ideal para estudiar, trabajar o utilizar tu computadora todos los días. Su diseño sencillo permite una escritura cómoda y práctica."
    },
    {
        titulo: "Mouse Gamer Razer DeathAdder Essential Negro",
        precio: 1490, descuento: 15, stock: 15,
        categoria: "Tecnología", vendedor: 0, imagen: "mouse-razer-deathadder.png",
        descripcion: "Mouse gamer Razer DeathAdder Essential en color negro, con diseño ergonómico y el clásico logo verde de Razer. Ideal para jugar videojuegos, trabajar o navegar con comodidad y precisión."
    },
    {
        titulo: "Auriculares Inalámbricos Bluetooth con Estuche de Carga Negro",
        precio: 2190, descuento: 0, stock: 21,
        categoria: "Tecnología", vendedor: 0, imagen: "auriculares-inalambricos-negro.png",
        descripcion: "Auriculares inalámbricos de diseño moderno en color negro, acompañados de un estuche compacto de carga. Ideales para escuchar música, mirar videos o atender llamadas cómodamente sin cables."
    },
    {
        titulo: "Auriculares Gamer JBL Quantum 100 M2 con Micrófono",
        precio: 3290, descuento: 20, stock: 12,
        categoria: "Tecnología", vendedor: 0, imagen: "auriculares-jbl-quantum.png",
        descripcion: "Auriculares gamer JBL Quantum 100 M2 en color negro, con micrófono integrado y diseño acolchado para mayor comodidad. Ideales para jugar videojuegos, comunicarte con tus compañeros y disfrutar de un sonido envolvente durante tus partidas."
    },
    {
        titulo: "Monitor LED de Pantalla Plana con Diseño Ultradelgado",
        precio: 8990, descuento: 0, stock: 9,
        categoria: "Tecnología", vendedor: 0, imagen: "monitor-led.png",
        descripcion: "Monitor de diseño moderno con pantalla amplia, bordes delgados y soporte de escritorio. Ideal para trabajar, estudiar, navegar por internet o disfrutar de tus videojuegos y contenido multimedia."
    },
    {
        titulo: "Control Inalámbrico Sony DualSense para PlayStation 5 Blanco",
        precio: 4290, descuento: 15, stock: 16,
        categoria: "Tecnología", vendedor: 0, imagen: "joystick-dualsense-blanco.png",
        descripcion: "Control Sony DualSense para PlayStation 5 en color blanco y negro, con joysticks analógicos, panel táctil y botones clásicos de PlayStation. Ideal para disfrutar de tus videojuegos favoritos con comodidad y precisión."
    },
    {
        titulo: "Consola Sony PlayStation 5 Digital Edition con Control DualSense",
        precio: 27990, descuento: 10, stock: 8,
        categoria: "Tecnología", vendedor: 0, imagen: "ps5-digital.png",
        descripcion: "Consola Sony PlayStation 5 Digital Edition en color blanco y negro, acompañada de un control inalámbrico DualSense. Ideal para disfrutar de videojuegos de última generación sin necesidad de utilizar discos físicos."
    },
    {
        titulo: "Smart TV LED de Pantalla Plana con Diseño Ultradelgado",
        precio: 16990, descuento: 0, stock: 10,
        categoria: "Tecnología", vendedor: 0, imagen: "smart-tv-led.png",
        descripcion: "Televisor LED de pantalla amplia con diseño moderno, bordes delgados y patas de apoyo laterales. Ideal para disfrutar de películas, series, deportes y videojuegos desde la comodidad de tu hogar."
    },
    {
        titulo: "Pendrive Kingston DataTraveler Exodia USB 3.2 de 64GB",
        precio: 390, descuento: 0, stock: 20,
        categoria: "Tecnología", vendedor: 0, imagen: "pendrive-kingston-64gb.png",
        descripcion: "Pendrive Kingston DataTraveler Exodia de 64GB con diseño compacto en color negro y detalle turquesa. Ideal para guardar, transportar y transferir documentos, fotografías, videos y otros archivos de forma práctica."
    },
    {
        titulo: "Pendrive Kingston DataTraveler Exodia USB 3.2 de 128GB",
        precio: 590, descuento: 15, stock: 16,
        categoria: "Tecnología", vendedor: 0, imagen: "pendrive-kingston-128gb.png",
        descripcion: "Pendrive Kingston DataTraveler Exodia de 128GB con diseño compacto en color negro y detalle amarillo. Una opción práctica para almacenar y transportar documentos, fotografías, videos y archivos personales."
    },
    {
        titulo: "Cable HDMI UGREEN de Alta Calidad",
        precio: 590, descuento: 0, stock: 13,
        categoria: "Tecnología", vendedor: 0, imagen: "cable-hdmi-ugreen.png",
        descripcion: "Cable HDMI UGREEN de color negro con conectores reforzados y revestimiento trenzado. Ideal para conectar televisores, monitores, consolas y otros dispositivos compatibles para transmitir imagen y sonido."
    },
    {
        titulo: "Lámpara de Mesa Decorativa con Pantalla Beige",
        precio: 1490, descuento: 0, stock: 12,
        categoria: "Hogar", vendedor: 1, imagen: "lampara-mesa.png",
        descripcion: "Lámpara de mesa con base metálica negra y pantalla de tela color beige, con un diseño elegante y minimalista. Ideal para iluminar y decorar dormitorios, escritorios o salas de estar, creando un ambiente cálido y acogedor."
    },
    {
        titulo: "Palmera Areca Decorativa con Maceta Metálica",
        precio: 2490, descuento: 15, stock: 9,
        categoria: "Hogar", vendedor: 1, imagen: "palmera-areca.png",
        descripcion: "Planta decorativa tipo palmera con abundantes hojas verdes y maceta cilíndrica de acabado metálico. Ideal para darle un toque natural y elegante a tu living, dormitorio, oficina o cualquier espacio interior."
    },
    {
        titulo: "Reloj de Pared Analógico Redondo con Marco Negro",
        precio: 890, descuento: 0, stock: 14,
        categoria: "Hogar", vendedor: 1, imagen: "reloj-pared.png",
        descripcion: "Reloj de pared analógico con marco negro, fondo blanco y números grandes de fácil lectura. Ideal para decorar y controlar la hora en dormitorios, cocinas, oficinas o salas de estar."
    },
    {
        titulo: "Juego de Sábanas en Tonos Pastel para Cama",
        precio: 1890, descuento: 20, stock: 11,
        categoria: "Hogar", vendedor: 1, imagen: "sabanas-pastel.png",
        descripcion: "Juego de sábanas de tela suave presentado en una variedad de colores pastel, incluyendo gris, rosa, amarillo, beige y verde. Ideal para renovar tu dormitorio y darle un estilo delicado, cálido y acogedor."
    },
    {
        titulo: "Vela Aromática Decorativa de Canela en Vaso de Vidrio",
        precio: 490, descuento: 0, stock: 17,
        categoria: "Hogar", vendedor: 6, imagen: "vela-canela.png",
        descripcion: "Vela aromática de color crema presentada en un elegante vaso de vidrio, decorada con ramas de canela y un lazo rústico. Ideal para perfumar tus ambientes y crear una atmósfera cálida y relajante en tu hogar."
    },
    {
        titulo: "Espejo de Cuerpo Entero con Marco Negro y Soporte",
        precio: 3490, descuento: 20, stock: 7,
        categoria: "Hogar", vendedor: 1, imagen: "espejo-cuerpo-entero.png",
        descripcion: "Espejo vertical de cuerpo entero con marco negro y soporte trasero para colocarlo de pie. Ideal para dormitorios, vestidores o recibidores, permitiéndote ver tu outfit completo antes de salir."
    },
    {
        titulo: "Espejo Redondo Decorativo con Marco Cromado",
        precio: 1290, descuento: 0, stock: 10,
        categoria: "Hogar", vendedor: 1, imagen: "espejo-redondo.png",
        descripcion: "Espejo redondo con superficie reflectante y elegante marco de acabado cromado. Ideal para decorar baños, dormitorios o recibidores, aportando luminosidad y amplitud a tus espacios."
    },
    {
        titulo: "Silla Moderna Tapizada con Apoyabrazos Color Negro",
        precio: 3290, descuento: 15, stock: 8,
        categoria: "Hogar", vendedor: 1, imagen: "silla-tapizada-negra.png",
        descripcion: "Silla moderna con asiento y respaldo tapizados en tela negra, apoyabrazos integrados y patas metálicas. Ideal para comedores, escritorios o espacios de trabajo, aportando comodidad y un diseño contemporáneo."
    },
    {
        titulo: "Silla de Comedor de Madera Color Nogal",
        precio: 2490, descuento: 0, stock: 12,
        categoria: "Hogar", vendedor: 1, imagen: "silla-madera-nogal.png",
        descripcion: "Silla de comedor fabricada en madera con acabado color nogal, asiento amplio y respaldo con listones verticales. Ideal para comedores, cocinas o espacios de reunión, combinando comodidad y un estilo clásico."
    },
    {
        titulo: "Mesa Auxiliar Redonda de Madera Natural",
        precio: 3290, descuento: 0, stock: 9,
        categoria: "Hogar", vendedor: 1, imagen: "mesa-redonda-madera.png",
        descripcion: "Mesa redonda de madera en tono natural, con superficie amplia y patas inclinadas que aportan estabilidad y un diseño moderno. Ideal para livings, comedores o espacios de reunión, combinando funcionalidad y estilo."
    },
    {
        titulo: "Set de Paños de Limpieza Multiuso de Colores",
        precio: 390, descuento: 0, stock: 20,
        categoria: "Hogar", vendedor: 1, imagen: "panos-colores.png",
        descripcion: "Set de paños de limpieza de tela absorbente en diferentes colores, con textura suave y práctica. Ideales para limpiar superficies, muebles, mesadas y utensilios del hogar, facilitando las tareas de todos los días."
    },
    {
        titulo: "Campera de Cuero Negra con Cierre",
        precio: 3990, descuento: 20, stock: 6,
        categoria: "Moda", vendedor: 2, imagen: "campera-cuero-negra.png",
        descripcion: "Campera negra de estilo urbano con acabado similar al cuero, cierre frontal y bolsillo con cierre en el pecho. Ideal para completar tus looks casuales y darle un toque moderno a tu vestimenta."
    },
    {
        titulo: "Gorra Clásica Negra con Visera Curva",
        precio: 590, descuento: 0, stock: 15,
        categoria: "Moda", vendedor: 6, imagen: "gorra-negra.png",
        descripcion: "Gorra clásica de color negro con visera curva, costuras visibles y diseño liso sin estampados. Ideal para complementar tus outfits diarios y protegerte del sol con un estilo casual."
    },
    {
        titulo: "Camisa Formal de Hombre Manga Larga Negra",
        precio: 1490, descuento: 0, stock: 10,
        categoria: "Moda", vendedor: 2, imagen: "camisa-negra.png",
        descripcion: "Camisa formal de color negro con cuello clásico, manga larga y cierre frontal con botones. Ideal para ocasiones especiales, reuniones o para combinar con un look elegante en el día a día."
    },
    {
        titulo: "Remera Básica de Hombre Color Rojo",
        precio: 590, descuento: 0, stock: 18,
        categoria: "Moda", vendedor: 2, imagen: "remera-roja.png",
        descripcion: "Remera básica de manga corta en color rojo, con cuello redondo y diseño liso. Ideal para el uso diario y para combinar fácilmente con jeans, bermudas o pantalones deportivos."
    },
    {
        titulo: "Pantalón Cargo de Hombre Color Gris Oscuro",
        precio: 1890, descuento: 15, stock: 9,
        categoria: "Moda", vendedor: 2, imagen: "pantalon-cargo-gris.png",
        descripcion: "Pantalón cargo de color gris oscuro con bolsillos laterales, cierre frontal y diseño de corte recto. Ideal para quienes buscan una prenda cómoda, práctica y versátil para el uso diario."
    },
    {
        titulo: "Zapatillas Nike Air Jordan 1 High Retro Rojas y Blancas",
        precio: 8990, descuento: 0, stock: 5,
        categoria: "Moda", vendedor: 2, imagen: "jordan-1-rojas.png",
        descripcion: "Zapatillas Nike Air Jordan de caña alta con combinación de colores rojo, blanco y negro, logo lateral y cierre con cordones. Ideales para complementar outfits urbanos y deportivos con un estilo clásico."
    },
    {
        titulo: "Zapatillas Nike ComfiRide Negras para Hombre",
        precio: 4290, descuento: 20, stock: 12,
        categoria: "Moda", vendedor: 2, imagen: "nike-comfiride-negras.png",
        descripcion: "Zapatillas deportivas Nike de color negro con detalles blancos, logo lateral y suela acolchada con tecnología ComfiRide. Ideales para caminar, realizar actividades cotidianas y completar un look deportivo."
    },
    {
        titulo: "Lentes de Sol Ray-Ban Aviador con Marco Dorado",
        precio: 4990, descuento: 0, stock: 7,
        categoria: "Moda", vendedor: 2, imagen: "lentes-aviador-dorados.png",
        descripcion: "Lentes de sol estilo aviador con marco metálico dorado y cristales oscuros en tono azul. Ideales para complementar tus outfits y proteger tus ojos de la luz solar."
    },
    {
        titulo: "Aros Colgantes Plateados con Piedras Transparentes",
        precio: 690, descuento: 0, stock: 14,
        categoria: "Moda", vendedor: 2, imagen: "aros-plateados-piedras.png",
        descripcion: "Par de aros colgantes con acabado plateado y piedras transparentes de diseño facetado. Ideales para complementar tus outfits y darle un toque elegante a tu estilo diario o a ocasiones especiales."
    },
    {
        titulo: "Aros Argolla Dorados Clásicos",
        precio: 490, descuento: 15, stock: 19,
        categoria: "Moda", vendedor: 2, imagen: "aros-argolla-dorados.png",
        descripcion: "Par de aros tipo argolla en color dorado, con diseño circular clásico y cierre integrado. Ideales para complementar distintos estilos y utilizar tanto en ocasiones casuales como formales."
    },
    {
        titulo: "Short de Baño para Hombre con Estampado Tropical",
        precio: 990, descuento: 0, stock: 13,
        categoria: "Moda", vendedor: 2, imagen: "short-bano-tropical.png",
        descripcion: "Short de baño masculino con estampado tropical de hojas en tonos verdes y azules, cintura elástica y cordón ajustable. Ideal para disfrutar de la playa, la piscina o actividades al aire libre durante el verano."
    },
    {
        titulo: "Valija Rígida de Viaje con Ruedas Giratorias Negra",
        precio: 2990, descuento: 15, stock: 8,
        categoria: "Otros", vendedor: 4, imagen: "valija-negra.png",
        descripcion: "Valija rígida de viaje en color negro con diseño moderno, ruedas giratorias y manija telescópica extensible. Ideal para transportar tu equipaje cómodamente durante viajes, vacaciones o escapadas de fin de semana."
    },
    {
        titulo: "Termo de Acero Inoxidable Color Plateado",
        precio: 990, descuento: 0, stock: 16,
        categoria: "Otros", vendedor: 4, imagen: "termo-acero.png",
        descripcion: "Termo de acero inoxidable con acabado plateado, diseño cilíndrico y tapa superior a rosca. Ideal para llevar tus bebidas favoritas al trabajo, estudio, viajes o actividades al aire libre."
    },
    {
        titulo: "Carpa de Camping para Actividades al Aire Libre",
        precio: 2490, descuento: 0, stock: 7,
        categoria: "Otros", vendedor: 4, imagen: "carpa-camping.png",
        descripcion: "Carpa de camping en color verde con diseño tipo iglú, entrada frontal y estructura compacta. Ideal para disfrutar de escapadas, campamentos y aventuras al aire libre."
    },
    {
        titulo: "Globo Terráqueo Decorativo con Base Dorada",
        precio: 1890, descuento: 20, stock: 10,
        categoria: "Otros", vendedor: 4, imagen: "globo-terraqueo.png",
        descripcion: "Globo terráqueo decorativo con representación de los continentes en tonos azules y dorados, acompañado de una base metálica elegante. Ideal para decorar escritorios, oficinas o espacios de estudio y consultar la ubicación de distintos países."
    },
    {
        titulo: "Set de Bolsas Reutilizables de Tela para Compras",
        precio: 490, descuento: 0, stock: 20,
        categoria: "Otros", vendedor: 4, imagen: "bolsas-tela.png",
        descripcion: "Set de tres bolsas reutilizables de tela en color natural, con diseños lisos, estampados y rayados. Ideales para realizar compras, transportar objetos o llevar tus pertenencias de manera práctica."
    },
    {
        titulo: "Guitarra Eléctrica Fender Stratocaster Sunburst",
        precio: 18990, descuento: 0, stock: 4,
        categoria: "Otros", vendedor: 4, imagen: "guitarra-electrica.png",
        descripcion: "Guitarra eléctrica estilo Stratocaster con acabado sunburst en tonos naranja, negro y blanco, tres micrófonos y diapasón de madera. Ideal para practicar, componer música y tocar diferentes estilos musicales."
    },
    {
        titulo: "Taladro Atornillador Inalámbrico Bosch Professional GSR 14.4-2-LI",
        precio: 7490, descuento: 15, stock: 8,
        categoria: "Herramientas", vendedor: 1, imagen: "taladro-bosch.png",
        descripcion: "Taladro atornillador inalámbrico Bosch Professional en color azul y negro, con batería recargable y mandril automático. Ideal para perforar superficies y realizar trabajos de instalación, reparación y mantenimiento."
    },
    {
        titulo: "Amoladora Angular Bosch GWS 850 C",
        precio: 4990, descuento: 0, stock: 6,
        categoria: "Herramientas", vendedor: 1, imagen: "amoladora-bosch.png",
        descripcion: "Amoladora angular Bosch con diseño compacto, empuñadura lateral y disco de corte. Ideal para cortar, desbastar y realizar trabajos de mantenimiento sobre diferentes materiales."
    },
    {
        titulo: "Serrucho Manual Profesional con Mango Ergonómico",
        precio: 690, descuento: 0, stock: 15,
        categoria: "Herramientas", vendedor: 1, imagen: "serrucho.png",
        descripcion: "Serrucho manual con hoja metálica dentada y mango ergonómico en colores naranja y negro. Ideal para realizar cortes de madera en trabajos de carpintería, reparaciones y proyectos de bricolaje."
    },
    {
        titulo: "Martillo de Carpintero con Mango Antideslizante",
        precio: 590, descuento: 20, stock: 12,
        categoria: "Herramientas", vendedor: 1, imagen: "martillo.png",
        descripcion: "Martillo de carpintero con cabeza metálica, superficie para golpear y extremo curvo para extraer clavos. Cuenta con mango amarillo y negro para un agarre cómodo durante trabajos de construcción y reparación."
    },
    {
        titulo: "Tenaza Sacaclavos Tolsen con Mango Antideslizante",
        precio: 790, descuento: 0, stock: 9,
        categoria: "Herramientas", vendedor: 1, imagen: "tenaza-tolsen.png",
        descripcion: "Tenaza metálica Tolsen con mordazas curvas y mangos largos de color negro con detalles amarillos. Ideal para sujetar, extraer clavos y realizar trabajos de carpintería y mantenimiento."
    },
    {
        titulo: "Cinta Métrica Retráctil de 5 Metros",
        precio: 290, descuento: 0, stock: 20,
        categoria: "Herramientas", vendedor: 1, imagen: "cinta-metrica.png",
        descripcion: "Cinta métrica retráctil con carcasa resistente en colores naranja y negro, gancho metálico y escala de medición visible. Ideal para tomar medidas en trabajos de construcción, carpintería y tareas del hogar."
    },
    {
        titulo: "Nivel de Burbuja Manual Color Amarillo",
        precio: 490, descuento: 0, stock: 11,
        categoria: "Herramientas", vendedor: 1, imagen: "nivel-burbuja.png",
        descripcion: "Nivel de burbuja manual con cuerpo alargado de color amarillo y ampollas de medición integradas. Ideal para comprobar la horizontalidad y verticalidad al instalar muebles, estantes y realizar trabajos de construcción."
    },
    {
        titulo: "Linterna Táctica LED Compacta",
        precio: 590, descuento: 0, stock: 14,
        categoria: "Herramientas", vendedor: 1, imagen: "linterna-tactica.png",
        descripcion: "Linterna táctica de diseño compacto con cuerpo cilíndrico metálico en color negro y cabezal de iluminación frontal. Ideal para iluminar espacios oscuros, realizar reparaciones y utilizar durante actividades al aire libre."
    },
    {
        titulo: "Linterna LED Recargable de Alta Iluminación",
        precio: 1290, descuento: 25, stock: 7,
        categoria: "Herramientas", vendedor: 1, imagen: "linterna-led.png",
        descripcion: "Linterna LED de diseño robusto con múltiples luces frontales, panel lateral de iluminación y mango superior para transportarla. Ideal para trabajos en lugares con poca luz, emergencias y actividades al aire libre."
    },
    {
        titulo: "Guantes de Trabajo Reforzados de Cuero y Tela",
        precio: 390, descuento: 0, stock: 18,
        categoria: "Herramientas", vendedor: 1, imagen: "guantes-trabajo.png",
        descripcion: "Par de guantes de trabajo con palma de color gris, dorso combinado y puños amarillos. Ideales para proteger las manos durante tareas de construcción, mantenimiento y manipulación de materiales."
    },
    {
        titulo: "Escalera Plegable de Aluminio de 4 Peldaños",
        precio: 2490, descuento: 15, stock: 5,
        categoria: "Herramientas", vendedor: 1, imagen: "escalera-aluminio.png",
        descripcion: "Escalera plegable de estructura metálica plateada con cuatro niveles de apoyo y terminaciones amarillas antideslizantes. Ideal para alcanzar lugares elevados durante tareas de limpieza, mantenimiento y reparaciones."
    },
    {
        titulo: "Pistola de Silicona Caliente Ingco",
        precio: 590, descuento: 0, stock: 13,
        categoria: "Herramientas", vendedor: 1, imagen: "pistola-silicona.png",
        descripcion: "Pistola encoladora Ingco de color amarillo y negro con gatillo ergonómico y boquilla metálica. Ideal para aplicar silicona caliente en manualidades, reparaciones, decoración y proyectos de bricolaje."
    },
    {
        titulo: "Cinta de Embalaje Scotch Marrón",
        precio: 150, descuento: 0, stock: 25,
        categoria: "Herramientas", vendedor: 1, imagen: "cinta-scotch.png",
        descripcion: "Rollo de cinta adhesiva Scotch de color marrón, ideal para cerrar cajas y asegurar paquetes. Una opción práctica para embalajes, mudanzas, almacenamiento y envíos de productos."
    },
    {
        titulo: "Cama Acolchada para Perros Ferplast Beige",
        precio: 1890, descuento: 15, stock: 8,
        categoria: "Mascotas", vendedor: 5, imagen: "cama-ferplast.png",
        descripcion: "Cama acolchada para mascotas con diseño rectangular, laterales elevados y tapizado en tonos beige. Ideal para que tu perro descanse cómodamente y tenga su propio espacio de descanso."
    },
    {
        titulo: "Cama Redonda para Mascotas con Estampado de Estrellas",
        precio: 990, descuento: 0, stock: 14,
        categoria: "Mascotas", vendedor: 5, imagen: "cama-estrellas.png",
        descripcion: "Cama redonda acolchada de color gris con estampado de estrellas blancas y bordes elevados. Ideal para que tu gato o perro pequeño descanse en un espacio cómodo y suave."
    },
    {
        titulo: "Rascador para Gatos con Poste de Sisal y Juguete",
        precio: 890, descuento: 0, stock: 12,
        categoria: "Mascotas", vendedor: 5, imagen: "rascador-gato.png",
        descripcion: "Rascador para gatos con base acolchada, poste recubierto de cuerda y plataforma superior. Incluye una pelota colgante para estimular el juego y ayudar a mantener entretenida a tu mascota."
    },
    {
        titulo: "Árbol Rascador para Gatos con Casita y Plataformas",
        precio: 3990, descuento: 20, stock: 5,
        categoria: "Mascotas", vendedor: 5, imagen: "arbol-rascador.png",
        descripcion: "Centro de actividades para gatos con diferentes plataformas, postes rascadores, casita y juguetes colgantes. Ideal para que tu gato juegue, trepe, descanse y afile sus uñas."
    },
    {
        titulo: "Comedero de Acero Inoxidable para Mascotas",
        precio: 290, descuento: 0, stock: 25,
        categoria: "Mascotas", vendedor: 5, imagen: "comedero-acero.png",
        descripcion: "Comedero individual de acero inoxidable con base antideslizante y diseño redondeado. Ideal para servir alimento o agua a tu perro o gato de forma práctica."
    },
    {
        titulo: "Correa Retráctil Flexi para Perros",
        precio: 1190, descuento: 15, stock: 10,
        categoria: "Mascotas", vendedor: 5, imagen: "correa-flexi.png",
        descripcion: "Correa retráctil Flexi con carcasa ergonómica negra, cinta extensible y gancho metálico. Ideal para pasear a tu perro con mayor libertad y controlar sus movimientos durante las salidas."
    },
    {
        titulo: "Collar Rojo para Gatos con Cascabel",
        precio: 190, descuento: 0, stock: 20,
        categoria: "Mascotas", vendedor: 5, imagen: "collar-rojo-gato.png",
        descripcion: "Collar rojo para gatos con hebilla ajustable, detalles metálicos y cascabel plateado. Un accesorio práctico para identificar a tu mascota y acompañarla en sus actividades diarias."
    },
    {
        titulo: "Collar Ajustable para Perros Color Violeta",
        precio: 350, descuento: 0, stock: 16,
        categoria: "Mascotas", vendedor: 5, imagen: "collar-violeta.png",
        descripcion: "Collar para perros confeccionado con tejido trenzado en tonos violeta y rosa, con hebilla de cierre y argolla metálica para colocar la correa. Ideal para los paseos diarios de tu mascota."
    },
    {
        titulo: "Arnés Rojo Ajustable para Perros",
        precio: 490, descuento: 20, stock: 11,
        categoria: "Mascotas", vendedor: 5, imagen: "arnes-rojo.png",
        descripcion: "Arnés para perros de color rojo con estampado de flores, correas ajustables y hebillas de cierre. Ideal para sujetar la correa y disfrutar de paseos más cómodos con tu mascota."
    },
    {
        titulo: "Transportadora para Mascotas con Puerta Metálica",
        precio: 1690, descuento: 0, stock: 7,
        categoria: "Mascotas", vendedor: 5, imagen: "transportadora.png",
        descripcion: "Transportadora para mascotas con estructura plástica en tonos azul y blanco, puerta frontal metálica y asa superior. Ideal para trasladar gatos y perros pequeños de forma práctica."
    },
    {
        titulo: "Juguete Mordedor con Forma de Hueso para Perros",
        precio: 290, descuento: 0, stock: 18,
        categoria: "Mascotas", vendedor: 5, imagen: "hueso-mordedor.png",
        descripcion: "Juguete mordedor de color celeste con forma de hueso y superficie cubierta de relieves. Ideal para entretener a tu perro y estimular el juego mediante la masticación."
    },
    {
        titulo: "Set de Ratones de Juguete para Gatos",
        precio: 190, descuento: 0, stock: 0,
        categoria: "Mascotas", vendedor: 5, imagen: "ratones-juguete.png",
        descripcion: "Set de dos juguetes con forma de ratón en colores rosa y celeste, fabricados con una superficie texturada y colas alargadas. Ideales para estimular el instinto de juego y mantener entretenido a tu gato."
    },
    {
        titulo: "Varita Interactiva para Gatos con Plumas",
        precio: 250, descuento: 0, stock: 13,
        categoria: "Mascotas", vendedor: 5, imagen: "varita-plumas.png",
        descripcion: "Juguete interactivo para gatos con varilla flexible, cuentas de colores, cascabel y plumas decorativas. Ideal para compartir momentos de juego con tu mascota y estimular su actividad física."
    },
    {
        titulo: "Pelota Mordedora de Goma para Perros",
        precio: 350, descuento: 15, stock: 15,
        categoria: "Mascotas", vendedor: 6, imagen: "pelota-mordedora.png",
        descripcion: "Pelota mordedora de goma en color rojo con diferentes relieves y ranuras en su superficie. Ideal para entretener a tu perro, estimular el juego y ofrecerle una opción para morder."
    },
    {
        titulo: "Kit de Acuario para Peces con Accesorios",
        precio: 2490, descuento: 25, stock: 0,
        categoria: "Mascotas", vendedor: 5, imagen: "acuario-kit.png",
        descripcion: "Kit para acuario con pecera rectangular de vidrio, tapa superior y elementos decorativos. Incluye accesorios para el cuidado de peces, ideal para comenzar a armar un pequeño espacio acuático en tu hogar."
    },
    {
        titulo: "Pelota de Fútbol Adidas Trionda League FIFA",
        precio: 2490, descuento: 0, stock: 14,
        categoria: "Deportes", vendedor: 3, imagen: "pelota-trionda.png",
        descripcion: "Pelota de fútbol Adidas Trionda League con diseño inspirado en la Copa Mundial de la FIFA 2026, combinando detalles azules, rojos, verdes y blancos. Ideal para jugar partidos, entrenar o disfrutar del fútbol con amigos."
    },
    {
        titulo: "Pelota de Fútbol Adidas Jabulani",
        precio: 1890, descuento: 15, stock: 9,
        categoria: "Deportes", vendedor: 3, imagen: "pelota-jabulani.png",
        descripcion: "Pelota de fútbol Adidas Jabulani con diseño blanco y detalles negros y amarillos, inspirada en el Mundial de Sudáfrica 2010. Ideal para jugar al fútbol, entrenar o sumar a una colección de artículos deportivos."
    },
    {
        titulo: "Pelota Adidas Champions League Final Cardiff 2017",
        precio: 2290, descuento: 0, stock: 7,
        categoria: "Deportes", vendedor: 3, imagen: "pelota-champions-cardiff.png",
        descripcion: "Pelota Adidas inspirada en la final de la UEFA Champions League 2017 disputada en Cardiff, con diseño blanco y paneles azules con estrellas. Ideal para practicar fútbol, jugar partidos o coleccionar recuerdos de la competición."
    },
    {
        titulo: "Réplica de la Copa Mundial de la FIFA",
        precio: 5990, descuento: 20, stock: 4,
        categoria: "Deportes", vendedor: 3, imagen: "copa-mundial-replica.png",
        descripcion: "Réplica de la emblemática Copa Mundial de la FIFA, con acabado dorado y base verde. Tiene un tamaño y peso cercanos a los de la copa original, ideal para coleccionistas, exhibición o decoración."
    },
    {
        titulo: "Botines Nike Mercurial de Fútbol con Cuello Alto",
        precio: 4290, descuento: 0, stock: 11,
        categoria: "Deportes", vendedor: 3, imagen: "botines-mercurial-negros.png",
        descripcion: "Botines Nike Mercurial en color negro con detalles verde flúor, cuello alto tejido y tapones en la suela. Su diseño está pensado para jugar al fútbol en canchas de césped natural y acompañarte durante los partidos."
    },
    {
        titulo: "Brazalete de Capitán Negro y Rosa",
        precio: 290, descuento: 0, stock: 18,
        categoria: "Deportes", vendedor: 3, imagen: "cinta-capitan.png",
        descripcion: "Brazalete de capitán deportivo en color negro con detalles rosas y una letra C blanca. Ideal para identificar al capitán de tu equipo durante los partidos y entrenamientos."
    },
    {
        titulo: "Raqueta de Tenis Dunlop Verde y Negra",
        precio: 3290, descuento: 15, stock: 9,
        categoria: "Deportes", vendedor: 3, imagen: "raqueta-tenis.png",
        descripcion: "Raqueta de tenis con diseño en verde lima y negro, encordado y empuñadura antideslizante. Ideal para practicar tenis, entrenar y disfrutar de partidos recreativos."
    },
    {
        titulo: "Set de Paletas de Ping Pong con Pelota",
        precio: 890, descuento: 0, stock: 15,
        categoria: "Deportes", vendedor: 3, imagen: "paletas-ping-pong.png",
        descripcion: "Set de dos paletas de tenis de mesa con superficies de goma texturizada y una pelota blanca. Perfecto para jugar al ping pong en casa, clubes o espacios recreativos."
    },
    {
        titulo: "Mesa de Ping Pong Donnay Azul",
        precio: 24990, descuento: 20, stock: 4,
        categoria: "Deportes", vendedor: 3, imagen: "mesa-ping-pong.png",
        descripcion: "Mesa de tenis de mesa de color azul con estructura metálica, red divisoria y ruedas para facilitar su traslado. Ideal para practicar ping pong y organizar partidos recreativos."
    },
    {
        titulo: "Cien Años de Soledad - Gabriel García Márquez",
        precio: 890, descuento: 0, stock: 14,
        categoria: "Libros", vendedor: 4, imagen: "libro-cien-anos.png",
        descripcion: "Obra clásica de Gabriel García Márquez, referente del realismo mágico y la literatura latinoamericana. Ideal para disfrutar de una historia familiar llena de personajes, misterios y acontecimientos extraordinarios."
    },
    {
        titulo: "Don Quijote de la Mancha - Miguel de Cervantes",
        precio: 790, descuento: 10, stock: 8,
        categoria: "Libros", vendedor: 4, imagen: "libro-quijote.png",
        descripcion: "Edición ilustrada de la reconocida obra de Miguel de Cervantes, protagonizada por Don Quijote y Sancho Panza. Una adaptación ideal para acercarte a uno de los clásicos más importantes de la literatura."
    },
    {
        titulo: "El Principito - Antoine de Saint-Exupéry",
        precio: 490, descuento: 0, stock: 22,
        categoria: "Libros", vendedor: 6, imagen: "libro-principito.png",
        descripcion: "Edición ilustrada de El Principito, el clásico de Antoine de Saint-Exupéry. Una historia llena de enseñanzas sobre la amistad, el amor y la vida, ideal para lectores de todas las edades."
    },
    {
        titulo: "1984 - George Orwell",
        precio: 690, descuento: 15, stock: 12,
        categoria: "Libros", vendedor: 4, imagen: "libro-1984.png",
        descripcion: "Novela distópica de George Orwell que presenta una sociedad controlada por un régimen totalitario. Una lectura atrapante que invita a reflexionar sobre la libertad, la vigilancia y el poder."
    },
    {
        titulo: "Harry Potter y la Piedra Filosofal - Edición Minalima",
        precio: 2490, descuento: 0, stock: 7,
        categoria: "Libros", vendedor: 4, imagen: "libro-harry-potter-1.png",
        descripcion: "Edición ilustrada de Harry Potter y la Piedra Filosofal, con diseño artístico y detalles visuales inspirados en el universo mágico de Hogwarts. Ideal para coleccionistas y fanáticos de la saga."
    },
    {
        titulo: "Colección Completa Harry Potter - 7 Libros",
        precio: 7990, descuento: 20, stock: 0,
        categoria: "Libros", vendedor: 4, imagen: "libro-harry-potter-coleccion.png",
        descripcion: "Colección de los siete libros de Harry Potter en un estuche ilustrado. Acompañá a Harry y sus amigos a lo largo de toda su aventura en Hogwarts. Una excelente opción para lectores y coleccionistas."
    },
    {
        titulo: "El Señor de los Anillos - La Comunidad del Anillo",
        precio: 990, descuento: 0, stock: 11,
        categoria: "Libros", vendedor: 4, imagen: "libro-senor-anillos.png",
        descripcion: "Primera parte de la épica saga fantástica de J.R.R. Tolkien. Acompañá a Frodo en el comienzo de una aventura por la Tierra Media llena de personajes, criaturas y desafíos."
    },
    {
        titulo: "El Hobbit - J.R.R. Tolkien",
        precio: 890, descuento: 0, stock: 16,
        categoria: "Libros", vendedor: 4, imagen: "libro-hobbit.png",
        descripcion: "Novela fantástica de J.R.R. Tolkien que cuenta la aventura de Bilbo Bolsón junto a un grupo de enanos. Ideal para descubrir el universo de la Tierra Media y disfrutar de una historia llena de aventuras."
    },
    {
        titulo: "Colección Los Juegos del Hambre - 4 Libros",
        precio: 4990, descuento: 25, stock: 0,
        categoria: "Libros", vendedor: 4, imagen: "libro-juegos-hambre.png",
        descripcion: "Colección de cuatro libros de la saga Los Juegos del Hambre, escrita por Suzanne Collins. Incluye las historias de Katniss Everdeen y el mundo de Panem. Ideal para fanáticos de la ciencia ficción y la aventura."
    },
    {
        titulo: "El Alquimista - Paulo Coelho",
        precio: 690, descuento: 0, stock: 19,
        categoria: "Libros", vendedor: 4, imagen: "libro-alquimista.png",
        descripcion: "Novela de Paulo Coelho que sigue el viaje de Santiago en busca de su tesoro personal. Una historia inspiradora sobre los sueños, el destino y la búsqueda del propio camino."
    },
    {
        titulo: "El Código Da Vinci - Dan Brown",
        precio: 790, descuento: 15, stock: 10,
        categoria: "Libros", vendedor: 4, imagen: "libro-codigo-da-vinci.png",
        descripcion: "Novela de misterio y suspenso escrita por Dan Brown. Acompañá a Robert Langdon en una investigación llena de enigmas, símbolos y secretos históricos."
    },
    {
        titulo: "Padre Rico, Padre Pobre - Robert Kiyosaki",
        precio: 790, descuento: 0, stock: 13,
        categoria: "Libros", vendedor: 4, imagen: "libro-padre-rico.png",
        descripcion: "Libro de educación financiera de Robert Kiyosaki que presenta distintas formas de entender el dinero, el ahorro y las inversiones. Ideal para aprender conceptos básicos sobre finanzas personales."
    },
    {
        titulo: "Diario de Ana Frank",
        precio: 650, descuento: 10, stock: 17,
        categoria: "Libros", vendedor: 4, imagen: "libro-ana-frank.png",
        descripcion: "Relato autobiográfico de Ana Frank, escrito durante su escondite en la Segunda Guerra Mundial. Un testimonio histórico y personal que permite conocer sus pensamientos y experiencias durante ese período."
    },
    {
        titulo: "L'Oréal HydraFresh Genius Water-Bursting Mask",
        precio: 1290, descuento: 15, stock: 12,
        categoria: "Belleza", vendedor: 2, imagen: "hydrafresh-mask.png",
        descripcion: "Mascarilla hidratante facial HydraFresh Genius de L'Oréal, presentada en un envase celeste. Ideal para complementar tu rutina de cuidado facial y aportar hidratación a la piel."
    },
    {
        titulo: "CeraVe Hydrating Cream-to-Foam Cleanser 236 ml",
        precio: 1190, descuento: 0, stock: 18,
        categoria: "Belleza", vendedor: 2, imagen: "cerave-limpiador.png",
        descripcion: "Limpiador facial hidratante CeraVe con textura crema que se transforma en espuma. Ayuda a limpiar la piel y retirar impurezas y maquillaje sin alterar su barrera protectora."
    },
    {
        titulo: "CeraVe Sérum Hidratante con Ácido Hialurónico 30 ml",
        precio: 1490, descuento: 10, stock: 9,
        categoria: "Belleza", vendedor: 2, imagen: "cerave-serum.png",
        descripcion: "Sérum facial hidratante CeraVe con ácido hialurónico, ceramidas y vitamina B5. Ideal para incorporar a tu rutina diaria y ayudar a mantener la hidratación y la barrera protectora de la piel."
    },
    {
        titulo: "Dermaglós Protector Solar FPS 50 250 ml",
        precio: 890, descuento: 0, stock: 20,
        categoria: "Belleza", vendedor: 2, imagen: "dermaglos-solar.png",
        descripcion: "Protector solar Dermaglós FPS 50 en presentación de 250 ml. Ofrece protección frente a los rayos UVA y UVB y es ideal para cuidar tu piel durante las actividades al aire libre."
    },
    {
        titulo: "Nivea Sun Protector Solar Piel Sensible FPS 50+ 200 ml",
        precio: 990, descuento: 20, stock: 14,
        categoria: "Belleza", vendedor: 2, imagen: "nivea-sun.png",
        descripcion: "Protector solar Nivea Sun FPS 50+ especialmente presentado para piel sensible. Cuenta con protección UVA y UVB y una textura ligera para acompañarte durante los días de sol."
    },
    {
        titulo: "Perfume Miss L'Bel",
        precio: 1890, descuento: 0, stock: 7,
        categoria: "Belleza", vendedor: 2, imagen: "perfume-miss-lbel.png",
        descripcion: "Fragancia femenina Miss de L'Bel presentada en un elegante frasco de vidrio con detalles dorados. Una opción ideal para complementar tu estilo y utilizar en distintas ocasiones."
    },
    {
        titulo: "Perfume Natura Essencial Oud",
        precio: 3290, descuento: 15, stock: 8,
        categoria: "Belleza", vendedor: 2, imagen: "perfume-natura-oud.png",
        descripcion: "Perfume Natura Essencial Oud con un elegante frasco azul oscuro y tapa negra. Una fragancia de presentación sofisticada, ideal para quienes buscan un perfume distintivo."
    },
    {
        titulo: "Perfume Azzaro Wanted Eau de Toilette 100 ml",
        precio: 4990, descuento: 0, stock: 5,
        categoria: "Belleza", vendedor: 2, imagen: "perfume-azzaro-wanted.png",
        descripcion: "Perfume masculino Azzaro Wanted Eau de Toilette en presentación de 100 ml. Su característico frasco con forma de tambor y detalles metálicos lo convierte en una excelente opción para regalar."
    },
    {
        titulo: "Perfume O Boticário Uomini",
        precio: 1590, descuento: 0, stock: 16,
        categoria: "Belleza", vendedor: 2, imagen: "perfume-uomini.png",
        descripcion: "Fragancia masculina Uomini de O Boticário, presentada en un frasco oscuro con detalles en dorado. Ideal para quienes buscan complementar su cuidado personal con un perfume de estilo clásico."
    },
    {
        titulo: "Base de Maquillaje MAC Studio Fix Fluid SPF 15",
        precio: 2490, descuento: 20, stock: 6,
        categoria: "Belleza", vendedor: 2, imagen: "base-mac.png",
        descripcion: "Base líquida MAC Studio Fix Fluid con acabado mate y protección SPF 15. Ideal para unificar el tono de tu piel y conseguir un maquillaje de aspecto uniforme."
    },
    {
        titulo: "Labial Cremoso Color Rojo",
        precio: 390, descuento: 0, stock: 21,
        categoria: "Belleza", vendedor: 2, imagen: "labial-rojo.png",
        descripcion: "Labial de color rojo intenso con presentación elegante en tonos dorados. Ideal para darle un toque de color a tus labios y complementar distintos estilos de maquillaje."
    },
    {
        titulo: "Paleta de Maquillaje Sleek con Sombras y Rubor",
        precio: 890, descuento: 10, stock: 13,
        categoria: "Belleza", vendedor: 2, imagen: "paleta-sleek.png",
        descripcion: "Paleta de maquillaje Sleek con diferentes tonos de sombras y rubor en una presentación compacta. Incluye aplicadores para facilitar la creación de distintos looks."
    },
    {
        titulo: "Kit Avadia Professional Nutrition Intense Shampoo y Acondicionador",
        precio: 1290, descuento: 25, stock: 10,
        categoria: "Belleza", vendedor: 2, imagen: "avadia-kit.png",
        descripcion: "Kit capilar Avadia Professional Nutrition Intense compuesto por shampoo y acondicionador. Está pensado para el cuidado del cabello seco, dañado y quebradizo, ayudando a complementar tu rutina de lavado."
    },
    {
        titulo: "Head & Shoulders Shampoo Cool Menthol",
        precio: 390, descuento: 0, stock: 24,
        categoria: "Belleza", vendedor: 2, imagen: "head-shoulders.png",
        descripcion: "Shampoo Head & Shoulders Cool Menthol con presentación blanca y detalles verdes. Su fórmula está orientada al cuidado del cuero cabelludo y al control de la caspa, con una sensación refrescante."
    },
    {
        titulo: "Caja Misteriosa Mystery Box Sorpresa",
        precio: 990, descuento: 0, stock: 15,
        categoria: "Otros", vendedor: 4, imagen: "mystery-box.png",
        descripcion: "Caja sorpresa Mystery Box con contenido variado y desconocido hasta el momento de abrirla. Ideal para quienes disfrutan de las sorpresas y quieren descubrir nuevos productos."
    },
    {
        titulo: "Hot Wheels Lata Coleccionable Custom Build",
        precio: 1290, descuento: 15, stock: 8,
        categoria: "Juguetes", vendedor: 3, imagen: "hot-wheels-lata.png",
        descripcion: "Lata metálica coleccionable de Hot Wheels con diseños de autos deportivos y clásicos. Cuenta con manija superior para transportarla y es ideal para guardar pequeños juguetes o ampliar tu colección."
    },
    {
        titulo: "Oso de Peluche Marrón con Moño",
        precio: 790, descuento: 0, stock: 12,
        categoria: "Juguetes", vendedor: 3, imagen: "oso-peluche.png",
        descripcion: "Oso de peluche marrón de textura suave, con detalles en color beige y un elegante moño oscuro. Ideal para regalar, decorar una habitación o acompañar a los más chicos."
    },
    {
        titulo: "Payaso de Peluche Colorido",
        precio: 590, descuento: 0, stock: 17,
        categoria: "Juguetes", vendedor: 3, imagen: "payaso-peluche.png",
        descripcion: "Payaso de peluche con vestimenta colorida, sombrero azul y amarillo y detalles en rojo y violeta. Una opción divertida para regalar, jugar o decorar espacios infantiles."
    },
    {
        titulo: "Funko Pop Marvel Magneto 640",
        precio: 1690, descuento: 20, stock: 6,
        categoria: "Juguetes", vendedor: 3, imagen: "funko-magneto.png",
        descripcion: "Figura coleccionable Funko Pop de Magneto, personaje del universo Marvel, identificada con el número 640. Viene en su caja original con ventana transparente, ideal para exhibir y coleccionar."
    },
    {
        titulo: "Funko Pop Pokémon Pikachu 353 Flocked",
        precio: 1890, descuento: 0, stock: 9,
        categoria: "Juguetes", vendedor: 3, imagen: "funko-pikachu.png",
        descripcion: "Figura Funko Pop de Pikachu de Pokémon, edición Flocked con acabado de textura aterciopelada. Presentada en su caja original, es ideal para fanáticos de Pokémon y coleccionistas."
    },
    {
        titulo: "Funko Pop Batman 275 Edición 80 Años",
        precio: 1790, descuento: 10, stock: 11,
        categoria: "Juguetes", vendedor: 3, imagen: "funko-batman.png",
        descripcion: "Figura coleccionable Funko Pop de Batman, versión clásica de 1989, identificada con el número 275. Incluye su caja original con diseño conmemorativo de los 80 años del personaje."
    },
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

    // borra los usuarios de prueba viejos y sus productos
    const usuariosAnteriores = await Usuario.find({ email: { $in: usuariosViejos } });
    const idsAnteriores = usuariosAnteriores.map(u => u._id);
    const productosAnteriores = await Producto.deleteMany({ vendedor: { $in: idsAnteriores } });
    const usuariosBorrados = await Usuario.deleteMany({ _id: { $in: idsAnteriores } });
    console.log(`0. Usuarios viejos borrados: ${usuariosBorrados.deletedCount} (con ${productosAnteriores.deletedCount} productos)`);

    // borra los productos que cargue a mano para probar (la cuenta queda)
    const cuentasPrueba = await Usuario.find({ nombre: "Emiliano", apellido: "Prueba" });
    const productosPrueba = await Producto.deleteMany({ vendedor: { $in: cuentasPrueba.map(u => u._id) } });
    console.log(`   Productos de prueba cargados a mano borrados: ${productosPrueba.deletedCount}`);

    // vendedores
    console.log("1. Vendedores");
    const idsVendedores = [];
    for (const datos of vendedores) {
        let vendedor = await Usuario.findOne({ email: datos.email });
        if (!vendedor) {
            const password = bcrypt.hashSync(passwordVendedores, Number(process.env.SALTING_ROUNDS));
            vendedor = new Usuario({ ...datos, password });
            await vendedor.save();
            console.log(`   + ${datos.email}`);
        }
        idsVendedores.push(vendedor._id);
    }

    // categorias
    console.log("2. Categorías");
    const idsCategorias = {};
    for (const nombre of categorias) {
        let categoria = await Categoria.findOne({ nombre });
        if (!categoria) {
            categoria = new Categoria({ nombre });
            await categoria.save();
            console.log(`   + ${nombre}`);
        }
        idsCategorias[nombre] = categoria._id;
    }

    const borrados = await Producto.deleteMany({ vendedor: { $in: idsVendedores } });
    console.log(`3. Productos de prueba anteriores borrados: ${borrados.deletedCount}`);

    // productos: sube la foto a cloudinary y guarda la url
    console.log("4. Productos");
    for (const datos of productos) {
        if (!idsVendedores[datos.vendedor]) {
            console.log(`   ⚠ "${datos.titulo}": no existe el vendedor ${datos.vendedor}, se saltea`);
            continue;
        }
        if (!idsCategorias[datos.categoria]) {
            console.log(`   ⚠ "${datos.titulo}": la categoría "${datos.categoria}" no está en la lista, se saltea`);
            continue;
        }
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
