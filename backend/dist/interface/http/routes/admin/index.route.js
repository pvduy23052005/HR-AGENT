"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../../middlewares/admin/auth.middleware");
const auth_route_1 = require("./auth.route");
const user_route_1 = require("./user.route");
const indexAdminRoute = (app) => {
    const BASE_URL = '/admin';
    app.use(`${BASE_URL}/auth`, auth_route_1.authRoute);
    app.use(`${BASE_URL}/users`, auth_middleware_1.authMiddleware, user_route_1.userRoute);
};
exports.default = indexAdminRoute;
//# sourceMappingURL=index.route.js.map