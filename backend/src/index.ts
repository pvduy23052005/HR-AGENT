import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as database from './infrastructure/config/database';
import indexAdminRoute from './interface/http/routes/admin/index.route';
import indexClientRoute from './interface/http/routes/client/index.route';

const app = express();
const PORT: number = parseInt(process.env.PORT ?? '3000', 10);

app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:5173',
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
