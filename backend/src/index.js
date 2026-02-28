import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import * as database from "./config/database.js";
import indexAdminRoute from "./routes/admin/index.route.js";
import indexClientRoute from "./routes/client/index.route.js";

import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

database.connectDatabase();
indexAdminRoute(app);
indexClientRoute(app);

app.listen(PORT, () => {
  console.log(`Backend admin đang chạy tại: http://localhost:${PORT}`);
});