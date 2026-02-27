import { authRoute } from "./auth.route.js";
import { userRoute } from "./user.route.js";
import { authMiddleware } from "../../middlewares/client/auth.middleware.js";

const indexClientRoute = (app) => {
  app.use("/auth", authRoute);

  app.use("/user", authMiddleware, userRoute);
};

export default indexClientRoute;