import { authRoute } from "./auth.route.js";
import { userRoute } from "./user.route.js";
import { uploadRoute } from "./upload.route.js";

import { authMiddleware } from "../../middlewares/client/auth.middleware.js";

const indexClientRoute = (app) => {
  app.use("/auth", authRoute);

  app.use("/user", userRoute);

  app.user("/upload", authMiddleware, uploadRoute);
};

export default indexClientRoute;
