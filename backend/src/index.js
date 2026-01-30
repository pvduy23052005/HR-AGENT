import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as database from "./config/database.js";
import indexAdminRoute from "./routes/admin/index.route.js";

const app = express();
const PORT = 3000;
dotenv.config();

app.use(cors());
app.use(express.json());

database.connectDatabase();
indexAdminRoute(app);

app.listen(PORT, () => {
  console.log(`🚀 Backend đang chạy tại: http://localhost:${PORT}`);
});
