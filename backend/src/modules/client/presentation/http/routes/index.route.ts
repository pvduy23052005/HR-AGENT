import { Express } from 'express';
import { authRoute } from './auth.route';
import { userRoute } from './user.route';
import { uploadRoute } from './upload.route';
import { jobRoute } from './job.route';
import { aiRoute } from './analyze.route';
import { candidateRoute } from "./candidate.route";
import { interviewRoute } from './interview.route';
import { emailRoute } from './email.route';
import { reportRoute } from './report.route';
import { verificationRoute } from './verfication.route';

import { authMiddleware } from '../middlewares/auth.middleware';

const indexClientRoute = (app: Express): void => {
  app.use('/auth', authRoute);

  app.use('/user', userRoute);

  app.use('/upload', authMiddleware, uploadRoute);

  app.use('/job', authMiddleware, jobRoute);

  app.use('/ai', authMiddleware, aiRoute);

  app.use("/candidates", authMiddleware, candidateRoute);

  app.use('/interview', authMiddleware, interviewRoute);

  app.use('/email', authMiddleware, emailRoute);

  app.use('/report', authMiddleware, reportRoute);

  app.use('/verification', authMiddleware, verificationRoute);
};

export default indexClientRoute;
