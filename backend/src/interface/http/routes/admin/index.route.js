import { authMiddleware } from "../../middlewares/admin/auth.middleware.js";
import { authRoute } from "./auth.route.js";
import { userRoute } from "./user.route.js";
import { dashboardRoute } from "./dashboard.route.js";
import { statisticsRoute } from "./statistics.route.js";
import { aiconfigRoute } from "./aiconfig.route.js";

const indexAdminRoute = (app) => {
  const BASE_URL = "/admin";

  app.use(`${BASE_URL}/auth`, authRoute);

  app.use(`${BASE_URL}/users`, authMiddleware, userRoute);
  app.use(`${BASE_URL}/dashboard`, authMiddleware, dashboardRoute);
  app.use(`${BASE_URL}/statistics`, authMiddleware, statisticsRoute);
  app.use(`${BASE_URL}/aiconfig`, authMiddleware, aiconfigRoute);
};

export default indexAdminRoute;