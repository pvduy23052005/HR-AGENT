import { authMiddleware } from "../../middlewares/admin/auth.middleware.js";
import { authRoute } from "./auth.route.js";
import { userRoute } from "./user.route.js";

const indexAdminRoute = (app) => {
  const BASE_URL = "/admin";

  app.use(`${BASE_URL}/auth`, authRoute);

  app.use(`${BASE_URL}/user`, authMiddleware, userRoute);
};

export default indexAdminRoute;
