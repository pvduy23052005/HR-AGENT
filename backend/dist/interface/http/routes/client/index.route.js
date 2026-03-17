"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_route_1 = require("./auth.route");
const user_route_1 = require("./user.route");
const upload_route_1 = require("./upload.route");
const job_route_1 = require("./job.route");
const aiAnalyize_route_1 = require("./aiAnalyize.route");
const candidate_route_1 = require("./candidate.route");
const interview_route_1 = require("./interview.route");
const report_route_1 = require("./report.route");
const sourcing_route_1 = require("./sourcing.route");
const verfication_route_1 = require("./verfication.route");
const auth_middleware_1 = require("../../middlewares/client/auth.middleware");
const indexClientRoute = (app) => {
    app.use('/auth', auth_route_1.authRoute);
    app.use('/user', user_route_1.userRoute);
    app.use('/upload', auth_middleware_1.authMiddleware, upload_route_1.uploadRoute);
    app.use('/job', auth_middleware_1.authMiddleware, job_route_1.jobRoute);
    app.use('/ai', auth_middleware_1.authMiddleware, aiAnalyize_route_1.aiRoute);
    app.use("/candidates", auth_middleware_1.authMiddleware, candidate_route_1.candidateRoute);
    app.use('/interview', auth_middleware_1.authMiddleware, interview_route_1.interviewRoute);
    app.use('/report', auth_middleware_1.authMiddleware, report_route_1.reportRoute);
    app.use('/sourcing', auth_middleware_1.authMiddleware, sourcing_route_1.sourcingRoute);
    app.use('/verification', auth_middleware_1.authMiddleware, verfication_route_1.verificationRoute);
};
exports.default = indexClientRoute;
//# sourceMappingURL=index.route.js.map