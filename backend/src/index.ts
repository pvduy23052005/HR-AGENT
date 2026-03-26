import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as database from './infrastructure/config/database';
import indexAdminRoute from './presentatation/http/routes/admin/index.route';
import indexClientRoute from './presentatation/http/routes/client/index.route';

const app = express();
const PORT: number = parseInt(process.env.PORT ?? '3000', 10);

app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:5173'];

      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('chrome-extension://')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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