import { accountRoute } from "./account.route.js";

const indexAdminRoute = (app) => {
  const BASE_URL = "/admin";

  app.use(`${BASE_URL}/account`, accountRoute);
};

export default indexAdminRoute;
