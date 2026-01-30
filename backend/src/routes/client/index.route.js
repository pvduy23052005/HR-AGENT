import { authRoute } from "./auth.route.js";

const indexClientRoute = (app) => {
  app.use("/auth", authRoute);
};

export default indexClientRoute;
