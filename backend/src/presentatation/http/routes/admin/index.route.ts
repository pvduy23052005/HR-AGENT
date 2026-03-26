import { authMiddleware } from '../../middlewares/admin/auth.middleware';
import { authRoute } from './auth.route';
import { userRoute } from './user.route';
import { statisticsRoute } from './statistics.route';
import { Express } from 'express';

const indexAdminRoute = (app: Express): void => {
  const BASE_URL = '/admin';

  app.use(`${BASE_URL}/auth`, authRoute);
  
  app.use(`${BASE_URL}/users`, authMiddleware, userRoute);
  
  app.use(`${BASE_URL}/report`, authMiddleware, statisticsRoute);
};

export default indexAdminRoute;
