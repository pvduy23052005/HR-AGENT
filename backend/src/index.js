import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as database from "./config/database.js";
import indexAdminRoute from "./routes/admin/index.route.js";
import indexClientRoute from "./routes/client/index.route.js";

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();

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
