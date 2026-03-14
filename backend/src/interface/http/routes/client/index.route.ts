import { Express } from 'express';
import { authRoute } from './auth.route';
import { userRoute } from './user.route';
import { uploadRoute } from './upload.route';
import { jobRoute } from './job.route';
import { aiRoute } from './aiAnalyize.route';
import { candidateRoute } from "./candidate.route";
import { interviewRoute } from './interview.route';
import { reportRoute } from './report.route';
import { authMiddleware } from '../../middlewares/client/auth.middleware';

const indexClientRoute = (app: Express): void => {
  app.use('/auth', authRoute);

  app.use('/user', userRoute);

  app.use('/upload', authMiddleware, uploadRoute);

  app.use('/job', authMiddleware, jobRoute);

  app.use('/ai', authMiddleware, aiRoute);

  app.use("/candidates", candidateRoute)

  app.use('/interview', authMiddleware, interviewRoute);

  app.use('/report', authMiddleware, reportRoute);
};

export default indexClientRoute;
