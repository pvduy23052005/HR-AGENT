import { authRoute } from './auth.route';
import { userRoute } from './user.route';
import { uploadRoute } from './upload.route';
import { jobRoute } from './job.route';
import { aiRoute } from './aiAnalyize.route';
import { authMiddleware } from '../../middlewares/client/auth.middleware';
import { Express } from 'express';

const indexClientRoute = (app: Express): void => {
  app.use('/auth', authRoute);
  app.use('/user', userRoute);
  app.use('/upload', authMiddleware, uploadRoute);
  app.use('/job', authMiddleware, jobRoute);
  app.use('/ai', authMiddleware, aiRoute);
};

export default indexClientRoute;
