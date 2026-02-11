import { authRoute } from "./auth.route.js";
import { userRoute } from "./user.route.js";

const indexAdminRoute = (app) => {
  const BASE_URL = "/admin";

  app.use(`${BASE_URL}/auth`, authRoute);

  app.use(`${BASE_URL}/user`, userRoute);
};

export default indexAdminRoute;
