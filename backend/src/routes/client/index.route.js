import { authRoute } from "./auth.route.js";
import { userRoute } from "./user.route.js";
import { authMiddleware } from "../../middlewares/client/auth.middleware.js";

const indexClientRoute = (app) => {
  app.use("/auth", authRoute);

  // Note: userRoute now handles its own middleware per-endpoint or some endpoints are public (like forgot password).
  app.use("/user", userRoute);
};

export default indexClientRoute;