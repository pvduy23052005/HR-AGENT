import { authRoute } from "./auth.route.js";
import { userRoute } from "./user.route.js";

const indexClientRoute = (app) => {
  app.use("/auth", authRoute);

  app.use("/user", userRoute);
};

export default indexClientRoute;
