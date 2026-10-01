import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { limiterGlobal } from "./v1/middlewares/rateLimit.middleware.js";
import conectDB from "./v1/config/db.config.js";
import notFoundMiddleware from "./v1/middlewares/notFound.middleware.js";
import v1 from "./v1/v1.routes.js";
import {errorMiddleware} from "./v1/middlewares/error.middleware.js";

conectDB();

const app = express();

app.set("trust proxy", 1); 


const corsOptions = {
  origin: ["http://localhost:5173"], 
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(helmet()); 
app.use(limiterGlobal); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Nueva respuesta desde el servidor");
});

app.use("/v1", v1);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;